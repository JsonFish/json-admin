<template>
  <el-card>
    <el-descriptions title="前台信息" direction="vertical" :column="4" border>
      <template #extra>
        <el-button
          size="small"
          v-show="edit"
          plain
          type="primary"
          @click="updateBtn"
          >保存</el-button
        >
        <el-button size="small" v-show="edit" plain @click="cancel"
          >取消</el-button
        >
        <el-button
          size="small"
          v-show="!edit"
          plain
          type="primary"
          @click="editInformation"
        >
          修改
        </el-button>
      </template>
      <el-descriptions-item width="300" :span="1">
        <template #label>
          <div>博客名称</div>
        </template>
        <el-input size="small" v-if="edit" v-model="information.blogName" />
        <span v-else>{{ information.blogName }} </span>
      </el-descriptions-item>
      <el-descriptions-item width="400" :span="1">
        <template #label>
          <div>个性签名</div>
        </template>
        <el-input size="small" v-if="edit" v-model="information.personalSay" />
        <span v-else>{{ information.personalSay }} </span>
      </el-descriptions-item>
      <el-descriptions-item label="公告" :span="2">
        <el-input size="small" v-if="edit" v-model="information.blogNotice" />
        <span v-else>{{ information.blogNotice }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="gitee" :span="1">
        <el-input size="small" v-if="edit" v-model="information.giteeLink" />
        <span v-else>{{ information.giteeLink }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="github" :span="1">
        <el-input size="small" v-if="edit" v-model="information.githubLink" />
        <span v-else>{{ information.githubLink }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="bilibili" :span="2">
        <el-input size="small" v-if="edit" v-model="information.bilibiliLink" />
        <span v-else>{{ information.bilibiliLink }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="csdn" :span="2">
        <el-input size="small" v-if="edit" v-model="information.csdnLink" />
        <span v-else>{{ information.csdnLink }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="掘金" :span="2">
        <el-input size="small" v-if="edit" v-model="information.juejinLink" />
        <span v-else>{{ information.juejinLink }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="头像" :span="1">
        <Upload
          v-model:fileList="avatarImage"
          @getFileList="getFileList"
          :fileSize="2"
          :hiddenDelete="hiddenDeleteBtn"
        />
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { UploadUserFile } from "element-plus";
import Upload from "@/components/ReUpload/index.vue";
import { updateInfo, getInfo } from "@/api/information";
import type { Information } from "@/api/information/type";
import { message } from "@/utils/message";
const avatarImage = ref<UploadUserFile[]>([]);
const edit = ref<boolean>(false);
const hiddenDeleteBtn = ref<boolean>(true);
const information = ref<Information>({
  blogName: "", // 博客名
  blogAvatar: "", // 博客头像
  personalSay: "", // 个签
  blogNotice: "", // 公告
  githubLink: "", // GitHub
  giteeLink: "", // 码云
  bilibiliLink: "", // B站
  csdnLink: "", // CSDN
  juejinLink: "" // 掘金
});
onMounted(() => {
  getInformation();
});
const getInformation = () => {
  getInfo().then(response => {
    Object.assign(information.value, response.data);
    avatarImage.value[0] = {
      name: "avatar",
      url: information.value.blogAvatar
    };
  });
};
// 修改按钮
const editInformation = () => {
  edit.value = true;
  hiddenDeleteBtn.value = false;
};
const cancel = () => {
  hiddenDeleteBtn.value = true;
  edit.value = false;
};
const getFileList = imageList => {
  console.log(imageList);
};

// 保存
const updateBtn = () => {
  updateInfo(information.value).then(response => {
    if (response.code == 200) {
      message("修改成功", { type: "success" });
      getInformation();
    } else {
      message(response.message, { type: "error" });
    }
    edit.value = false;
    hiddenDeleteBtn.value = true;
  });
};
</script>

<style lang="scss" scoped>
.background {
  :deep(.el-form-item__content) {
    width: 208px !important;
    height: 148px !important;
  }

  :deep(.el-upload-list__item) {
    width: 208px !important;
    height: 148px !important;
    margin: 0 !important;
    border: none !important;
  }

  :deep(.el-upload--picture-card) {
    width: 208px !important;
    height: 148px !important;
  }

  :deep(.el-upload-list--picture-card) {
    width: 208px !important;
    height: 148px !important;
    margin: 0 !important;
    border: none !important;
  }
}
</style>
