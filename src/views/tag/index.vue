<template>
  <div>
    <el-card>
      <template #header>
        <div>标签管理</div>
      </template>
      <el-form :model="queryParams" :inline="true" ref="queryFormRef">
        <el-form-item label="标签名称:">
          <el-input
            style="width: 200px"
            v-model="queryParams.tagName"
            placeholder="请输入标签名称"
            prop="tagName"
            size="default"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="!queryParams.tagName"
            type="info"
            size="small"
            :icon="useRenderIcon(Search)"
            @click="getTagInfo"
            >搜索</el-button
          >
          <el-button
            type="default"
            :icon="useRenderIcon(Refresh)"
            @click="reset"
            size="small"
            >重置</el-button
          >
          <el-button
            type="primary"
            :icon="useRenderIcon(Plus)"
            @click="dialogVisible = true"
            size="small"
            >新增</el-button
          >
          <el-button
            :disabled="idList.length > 0 ? false : true"
            type="danger"
            :icon="useRenderIcon(Delete)"
            @click="deleteTagBtn"
            size="small"
            >批量删除</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        size="small"
        stripe
        v-loading="loading"
        :data="tagList"
        border
        @selection-change="handleSelectionChange"
        style="height: calc(100vh - 320px)"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column type="index" align="center" label="#" width="50" />
        <el-table-column
          prop="tagName"
          align="center"
          label="标签名称"
          width="200"
        />
        <el-table-column
          prop="create_time"
          align="center"
          label="创建时间"
          width="250"
        />
        <el-table-column
          prop="update_time"
          align="center"
          label="更新时间"
          width="300"
        />
        <el-table-column prop="address" label="操作" min-width="300">
          <template #default="scope">
            <div class="btnClass">
              <el-button
                link
                type="primary"
                size="small"
                @click="updateBtn(scope.row)"
                :icon="useRenderIcon(EditPen)"
                >修改</el-button
              >
              <el-popconfirm
                width="220"
                :title="`是否删除标签 ${scope.row.tagName} ?`"
                :icon="useRenderIcon(Warning)"
                icon-color="#f56c6c"
                @confirm="deleteTagBtn(scope.row)"
              >
                <template #reference>
                  <el-button
                    link
                    type="danger"
                    :icon="useRenderIcon(Delete)"
                    size="small"
                    >删除</el-button
                  >
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 30]"
          :small="true"
          background
          layout="->,total, sizes, prev, pager, next,jumper"
          :total="total"
          @size-change="getTagInfo"
          @current-change="getTagInfo"
        />
      </template>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      append-to-body
      :title="tagForm.id ? '修改标签' : '新增标签'"
      v-model="dialogVisible"
      width="30%"
      :before-close="cancel"
    >
      <el-form :model="tagForm" ref="dialogFormRef" label-width="100px">
        <el-form-item
          label="标签名称"
          :rules="[
            {
              required: true,
              min: 1,
              max: 20,
              message: '标签长度最长20位!',
              trigger: 'blur'
            }
          ]"
          prop="tagName"
        >
          <el-input
            v-model="tagForm.tagName"
            placeholder="请输入标签名称"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit(dialogFormRef)">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Search from "@iconify-icons/ep/search";
import Plus from "@iconify-icons/ep/plus";
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Warning from "@iconify-icons/ep/warning";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { onMounted, ref, reactive, nextTick } from "vue";
import type { TagInfo, QueryParams, TagForm } from "@/api/tag/type";
import { getTagList, deleteTag, addTag, updateTag } from "@/api/tag";
import { message } from "@/utils/message";
import { type FormInstance } from "element-plus";
defineOptions({
  name: "Tag"
});
// 查询参数
const queryParams = reactive<QueryParams>({
  tagName: "",
  page: 1,
  pageSize: 20
});
const queryFormRef = ref<FormInstance>();
const dialogFormRef = ref<FormInstance>();
const tagForm = reactive<TagForm>({
  id: null,
  tagName: ""
});
const total = ref<number>(0);
const loading = ref<boolean>(false);
const dialogVisible = ref<boolean>(false);
// tag列表
const tagList = ref<TagInfo[]>();
// 存储批量删除标签id
const idList = ref<Array<number>>([]);
onMounted(() => {
  getTagInfo();
});

// 获取tag数据
const getTagInfo = () => {
  loading.value = true;
  getTagList(queryParams).then(response => {
    tagList.value = response.data.tagList;
    total.value = response.data.total;
    loading.value = false;
  });
};
// 重置按钮回调
const reset = () => {
  // queryFormRef.value.resetFields(); // 无法重置
  queryParams.tagName = "";
  getTagInfo();
};
// dialog取消按钮回调
const cancel = () => {
  dialogVisible.value = false;
  dialogFormRef.value.resetFields();
  tagForm.id = null; // id不能重置
};
// 修改按钮回调
const updateBtn = (row: TagInfo) => {
  dialogVisible.value = true;
  // dialog + form resetFields() 无法重置问题
  nextTick(() => {
    tagForm.id = row.id;
    tagForm.tagName = row.tagName;
  });
};

const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid, fields): any => {
    if (valid) {
      if (tagForm.id) {
        updateTag(tagForm).then(response => {
          if (response.code == 200) {
            message("修改成功", { type: "success" });
            tagForm.id = null;
            getTagInfo();
          } else {
            message(response.message, { type: "error" });
          }
          dialogVisible.value = false;
          dialogFormRef.value.resetFields();
        });
      } else {
        delete tagForm.id;
        addTag(tagForm).then(response => {
          if (response.code == 200) {
            message("添加成功", { type: "success" });
            getTagInfo();
          } else {
            message(response.message, { type: "error" });
          }
          dialogVisible.value = false;
          dialogFormRef.value.resetFields();
        });
      }
    } else {
      return fields;
    }
  });
};
// checkBox处理
const handleSelectionChange = (tagList: TagInfo[]) => {
  idList.value = tagList.map((tagInfo: TagInfo) => {
    return tagInfo.id;
  });
};
// 删除按钮回调
const deleteTagBtn = (row: TagInfo | any) => {
  if (row.id) {
    idList.value = [];
    idList.value.push(row.id);
  }
  deleteTag({ id: idList.value }).then(response => {
    if (response.code == 200) {
      message("删除成功", { type: "success" });
      getTagInfo();
    } else {
      message(response.message, { type: "error" });
    }
  });
  idList.value = [];
};
</script>

<style lang="scss" scoped></style>
