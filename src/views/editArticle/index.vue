<script setup lang="ts">
import Promotion from "@iconify-icons/ep/promotion";
import Files from "@iconify-icons/ep/files";
import Close from "@/assets/svg/close.svg?component";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { reactive, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { FormInstance } from "element-plus";
import { MdEditor } from "md-editor-v3";
import type { Themes } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { addArticle, updateArticle, getArticle } from "@/api/article";
import type { ArticleInfo } from "@/api/article/type";
import type { UrlInfo } from "@/api/file/type";
import { getTagList } from "@/api/tag";
import { uploadFiles } from "@/api/file";
import { message } from "@/utils/message";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
defineOptions({
  name: "EditArticle"
});
const { layoutTheme } = useDataThemeChange();
const route = useRoute();
const router = useRouter();
const articleFormRef = ref<FormInstance>();
const drawerVisible = ref<boolean>(false);
const articleForm = reactive<ArticleInfo>({
  id: null,
  title: "", // 标题
  description: "", // 摘要
  content: "", // 文章内容
  tagIds: [], // 标签
  isTop: 0, // 0 不置顶
  status: 0 // 状态 0 文章 1 草稿
});
const tagList = ref<any>();
const mdTheme = ref<Themes>("light");
watch(
  () => layoutTheme.value.darkMode,
  newValue => {
    judgment(newValue);
  }
);
const judgment = (theme: boolean) => {
  if (theme) {
    mdTheme.value = "dark";
  } else {
    mdTheme.value = "light";
  }
};
onMounted(async () => {
  judgment(layoutTheme.value.darkMode);
  // 文章
  if (route.query.id) {
    await getArticle({ id: route.query.id as unknown as number }).then(
      (response: any) => {
        response.data.tagIds = response.data.tagIds
          .split(",")
          .map(item => +item);
        Object.assign(articleForm, response.data);
      }
    );
  }
  await getTagList().then(response => {
    tagList.value = response.data.tagList;
  });
});

// 存草稿逻辑
const saveDraft = () => {
  if (!articleForm.content) {
    message("文章内容不能为空 !", { type: "warning" });
    return;
  }
  drawerVisible.value = true;
  articleForm.status = 1;
};
// 打开Drawer回调函数
const openDrawer = async () => {
  if (!articleForm.content) {
    message("文章内容不能为空 !", { type: "warning" });
    return;
  }
  drawerVisible.value = true;
};

// 关闭Drawer
const closeDrawer = () => {
  drawerVisible.value = false;
  articleFormRef.value.resetFields();
  articleForm.status = 0;
};

// markDown上传图片
const onUploadImg = async (files: any[], callback: any) => {
  // files 上传文件数组
  const res = await Promise.all(
    files.map(file => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append("file", file);
        uploadFiles(form)
          .then(res => {
            if (res.code == 200) return rev(res.data);
            message(res.message, { type: "error" });
          })
          .catch(error => rej(error));
      });
    })
  );
  callback(res.map((item: UrlInfo) => item.url));
};

// 发布文章
const publishArticle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // 修改
      if (articleForm.id) {
        updateArticle(articleForm).then(response => {
          if (response.code == 200) {
            message("修改成功", { type: "success" });
            articleForm.content = "";
            articleForm.id = "";
            router.push("/article/manage");
          } else {
            message(response.message, { type: "error" });
          }
          closeDrawer();
        });
      } else {
        // 新增
        delete articleForm.id;
        addArticle(articleForm).then(response => {
          if (response.code == 200) {
            message("发布成功", { type: "success" });
            articleForm.content = "";
            router.push("/article/manage");
          } else {
            message(response.message, { type: "error" });
          }
          closeDrawer();
        });
      }
    } else {
      return fields;
    }
  });
};
</script>

<template>
  <div>
    <el-card>
      <template #header>
        <div class="header">
          <div>{{ articleForm.id ? "编辑文章" : "新增文章" }}</div>
          <el-row>
            <el-link
              v-if="!articleForm.id"
              style="margin-right: 20px"
              :underline="false"
              :icon="useRenderIcon(Files)"
              type="info"
              @click="saveDraft"
              size="small"
              >存草稿</el-link
            >
            <el-button
              plain
              :icon="useRenderIcon(Promotion)"
              type="primary"
              @click="openDrawer"
              size="small"
              >{{ articleForm.id ? "更新" : "发布" }}</el-button
            >
          </el-row>
        </div>
      </template>
      <MdEditor
        :theme="mdTheme"
        style="height: 72vh"
        v-model="articleForm.content"
        @onUploadImg="onUploadImg"
      />
      <el-drawer
        :close-on-click-modal="false"
        v-model="drawerVisible"
        @close="closeDrawer"
        :show-close="false"
      >
        <template #header="{ close, titleId, titleClass }">
          <div class="drawer-header">
            <span :id="titleId" :class="titleClass">{{
              articleForm.id ? "更新" : "发布"
            }}</span>
            <el-button
              size="large"
              link
              style="position: absolute; top: 4px; right: 5px"
              :icon="useRenderIcon(Close)"
              :underline="false"
              @click="close"
            />
          </div>
        </template>
        <el-form ref="articleFormRef" :model="articleForm" label-width="80px">
          <el-form-item
            label="标题"
            :rules="[
              {
                required: true,
                message: '标题不能为空 !'
              }
            ]"
            prop="title"
          >
            <el-input
              placeholder="请输入文章标题"
              v-model="articleForm.title"
            />
          </el-form-item>
          <el-form-item
            label="摘要"
            prop="description"
            :rules="[
              {
                required: true,
                message: '摘要不能为空 !'
              }
            ]"
          >
            <el-input
              type="textarea"
              placeholder="请输入文章摘要"
              v-model="articleForm.description"
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </el-form-item>
          <el-form-item
            label="标签"
            prop="tagIds"
            :rules="[
              {
                required: true,
                message: '标签不能为空 !'
              }
            ]"
          >
            <el-select
              filterable
              multiple
              v-model="articleForm.tagIds"
              clearable
              placeholder="请选择标签"
            >
              <el-option
                v-for="item in tagList"
                :key="item.id"
                :label="item.tagName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="置顶" prop="order">
            <el-input-number :min="0" v-model="articleForm.isTop" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div style="border-top: 1px solid gray; padding-top: 10px">
            <el-button @click="closeDrawer">取消</el-button>
            <el-button type="primary" @click="publishArticle(articleFormRef)"
              >确定</el-button
            >
          </div>
        </template>
      </el-drawer>
    </el-card>
  </div>
</template>

<style lang="css" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.drawer-header {
  position: relative;
  display: felx;
  border-bottom: 1px solid gray;
  padding-bottom: 10px;
}
.upload {
  :deep(.el-form-item__content) {
    width: 320px !important;
    height: 180px !important;
  }

  :deep(.el-upload-list__item) {
    width: 320px !important;
    height: 180px !important;
    margin: 0 !important;
    border: none !important;
  }

  :deep(.el-upload--picture-card) {
    width: 320px !important;
    height: 180px !important;
  }

  :deep(.el-upload-list--picture-card) {
    width: 320px !important;
    height: 180px !important;
    margin: 0 !important;
    border: none !important;
  }
}
</style>
