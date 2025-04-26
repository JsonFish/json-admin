<script setup lang="ts">
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Warning from "@iconify-icons/ep/warning";
import Check from "@iconify-icons/ep/check";
import Close from "@iconify-icons/ep/close";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Upload from "@/components/ReUpload/index.vue";
import { onMounted, ref, reactive, nextTick } from "vue";
import {
  getFriendLink,
  addFriendLink,
  updateFriendLink,
  deleteFriendLink,
  agreeLink
} from "@/api/link";
import type { QueryParmars, LinkInfo } from "@/api/link/type";
import { uploadFile } from "@/utils/upload";
import { message } from "@/utils/message";
import type {
  FormInstance,
  UploadUserFile,
  TabsPaneContext
} from "element-plus";
defineOptions({
  name: "FriendLink"
});

const queryParams = reactive<QueryParmars>({
  name: "",
  page: 1,
  pageSize: 10,
  status: 1
});
const queryFormRef = ref<FormInstance>();
const friendLinkFormRef = ref<FormInstance>();

const friendLinkImageList = ref<UploadUserFile[]>([]);
const friendLink = reactive<LinkInfo>({
  id: null,
  name: "",
  link: "",
  description: "",
  avatar: ""
});
const total = ref<number>(0);
const loading = ref<boolean>(false);
const dialogVisible = ref<boolean>(false);

const friendLinkList = ref<LinkInfo[]>();

// 存储批量删除分类id
const idList = ref<Array<number>>([]);

onMounted(() => {
  getFriendLinkList();
});

// 获取友链数据
const getFriendLinkList = () => {
  loading.value = true;
  getFriendLink(queryParams).then(response => {
    friendLinkList.value = response.data.linkList;
    total.value = response.data.total;
    loading.value = false;
  });
};
// 重置按钮回调
const reset = () => {
  // queryFormRef.value.resetFields(); // 无法重置
  queryParams.name = "";
  getFriendLinkList();
};
// 切换tabs
const tabClick = (tabPane: TabsPaneContext) => {
  queryParams.status = tabPane.props.name as number;
  friendLinkList.value = [];
  getFriendLinkList();
};
// dialog取消按钮回调
const cancel = () => {
  dialogVisible.value = false;
  friendLinkFormRef.value.resetFields();
  friendLink.id = null; // id不能重置
  friendLink.link = "";
  friendLinkImageList.value = [];
};
// 修改按钮回调
const updateBtn = (row: LinkInfo) => {
  dialogVisible.value = true;
  // friendLinkFormRef.value.resetFields();
  // dialog + form resetFields() 无法重置问题
  nextTick(() => {
    Object.assign(friendLink, row);
    friendLinkImageList.value[0] = {
      url: row.avatar,
      name: row.name
    };
  });
};
// 同意友链申请
const agreeApply = (row: LinkInfo) => {
  agreeLink({ id: row.id }).then(response => {
    if (response.code == 200) {
      message("操作成功", { type: "success" });
      getFriendLinkList();
    } else {
      message(response.message, { type: "error" });
    }
  });
};
// 获取要上传的文件
const getFileList = (fileList: UploadUserFile[]) => {
  friendLinkImageList.value = fileList;
};

// dialog确定按钮回调
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  if (friendLink.id) {
    // 修改
    // 先判断是否更换封面
    if (friendLinkImageList.value.length == 0) {
      friendLink.avatar = "";
    }
    if (
      friendLinkImageList.value.length != 0 &&
      friendLinkImageList.value[0].url != friendLink.avatar
    ) {
      await uploadFile(friendLinkImageList.value).then(response => {
        friendLink.avatar = response.url;
      });
    }
    // 再校验
    formEl.validate(async (valid, fields): Promise<any> => {
      if (valid) {
        updateFriendLink(friendLink).then(response => {
          if (response.code == 200) {
            message("修改成功", { type: "success" });
            getFriendLinkList();
            cancel();
          } else {
            message(response.message, { type: "error" });
          }
        });
      } else {
        return fields;
      }
    });
  } else {
    // 添加
    // 先上传封面
    if (friendLinkImageList.value.length != 0) {
      await uploadFile(friendLinkImageList.value).then(response => {
        friendLink.avatar = response.url;
      });
    }
    // 再校验
    formEl.validate((valid, fields): any => {
      if (valid) {
        delete friendLink.id;
        friendLink.status = 1;
        addFriendLink(friendLink).then(response => {
          if (response.code == 200) {
            message("添加成功", { type: "success" });
            cancel();
            getFriendLinkList();
          } else {
            message(response.message, { type: "error" });
          }
        });
      } else {
        return fields;
      }
    });
  }
};
// checkBox处理
const handleSelectionChange = (friendLinkList: LinkInfo[]) => {
  // 获取选中数据的id
  idList.value = friendLinkList.map(friendLinkInfo => {
    return friendLinkInfo.id;
  });
};
// 删除按钮回调
const deleteBtn = (row: LinkInfo | any) => {
  if (row.id) {
    idList.value = [];
    idList.value.push(row.id);
  }
  deleteFriendLink({ id: idList.value }).then(response => {
    if (response.code == 200) {
      message("删除成功", { type: "success" });
      getFriendLinkList();
    } else {
      message(response.message, { type: "error" });
    }
  });
  idList.value = [];
};
</script>

<template>
  <div>
    <el-card>
      <template #header>
        <div>友链管理</div>
      </template>
      <el-row>
        <el-form :model="queryParams" :inline="true" ref="queryFormRef">
          <el-form-item label="网站名称:">
            <el-input
              style="width: 200px"
              width="200"
              v-model="queryParams.name"
              placeholder="请输入网站名称"
              prop="name"
              clearable
            />
          </el-form-item>
        </el-form>
        <el-form-item>
          <el-button
            size="small"
            :disabled="!queryParams.name"
            type="primary"
            :icon="useRenderIcon(Search)"
            @click="getFriendLinkList"
            >搜索</el-button
          >
          <el-button
            size="small"
            type="info"
            :icon="useRenderIcon(Refresh)"
            @click="reset"
            >重置</el-button
          >
          <el-button
            size="small"
            :disabled="idList.length > 0 ? false : true"
            type="danger"
            :icon="useRenderIcon(Delete)"
            @click="deleteBtn"
            >批量删除</el-button
          >
        </el-form-item>
      </el-row>
      <el-tabs :model-value="1" @tab-click="tabClick">
        <el-tab-pane label="审核通过" :name="1">
          <el-table
            size="small"
            stripe
            v-loading="loading"
            :data="friendLinkList"
            border
            @selection-change="handleSelectionChange"
            style="height: calc(100vh - 372px)"
          >
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column type="index" align="center" label="#" width="40" />
            <el-table-column
              prop="name"
              align="center"
              label="名称"
              width="180"
            />
            <el-table-column
              prop="avatar"
              label="头像"
              align="center"
              width="80"
            >
              <template v-slot="scope">
                <el-avatar :src="scope.row.avatar" />
              </template>
            </el-table-column>
            <el-table-column
              prop="description"
              align="center"
              label="描述"
              width="220"
            />
            <el-table-column
              prop="link"
              align="center"
              label="链接"
              width="180"
            />
            <el-table-column
              prop="username"
              align="center"
              label="申请用户"
              width="100"
            />
            <el-table-column
              prop="userAvatar"
              align="center"
              label="用户头像"
              width="100"
            >
              <template v-slot="scope">
                <el-avatar :src="scope.row.userAvatar" />
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="email"
              align="center"
              label="用户邮箱"
              width="200"
            /> -->
            <el-table-column
              prop="create_time"
              align="center"
              label="申请时间"
              width="180"
            />
            <el-table-column
              prop="update_time"
              align="center"
              label="更新时间"
              width="180"
            />
            <el-table-column label="操作" min-width="100">
              <template #default="scope">
                <div>
                  <el-button
                    link
                    type="primary"
                    @click="updateBtn(scope.row)"
                    :icon="useRenderIcon(EditPen)"
                    size="small"
                    >修改</el-button
                  >
                  <el-popconfirm
                    width="220"
                    :title="`是否删除: ${scope.row.name} ?`"
                    :icon="useRenderIcon(Warning)"
                    icon-color="#f56c6c"
                    @confirm="deleteBtn(scope.row)"
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
          </el-table></el-tab-pane
        >
        <el-tab-pane label="待审核" :name="0">
          <el-table
            size="small"
            stripe
            v-loading="loading"
            :data="friendLinkList"
            border
            @selection-change="handleSelectionChange"
            style="height: calc(100vh - 372px)"
          >
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column type="index" align="center" label="#" width="40" />
            <el-table-column
              prop="name"
              align="center"
              label="名称"
              width="180"
            />
            <el-table-column
              prop="avatar"
              label="头像"
              align="center"
              width="80"
            >
              <template v-slot="scope">
                <el-avatar :src="scope.row.avatar" />
              </template>
            </el-table-column>
            <el-table-column
              prop="description"
              align="center"
              label="描述"
              show-overflow-tooltip
              width="220"
            />
            <el-table-column
              prop="link"
              align="center"
              label="链接"
              width="220"
            />
            <el-table-column
              prop="create_time"
              align="center"
              label="申请时间"
              width="180"
            />
            <el-table-column
              prop="user_id"
              align="center"
              label="申请人"
              width="180"
            />
            <el-table-column label="操作" min-width="180">
              <template #default="scope">
                <div>
                  <el-popconfirm
                    width="220"
                    :title="`是否同意 ${scope.row.name} 的友链申请?`"
                    :icon="useRenderIcon(Check)"
                    icon-color="#218c3f"
                    @confirm="agreeApply(scope.row)"
                  >
                    <template #reference>
                      <el-button
                        link
                        type="primary"
                        :icon="useRenderIcon(Check)"
                        size="small"
                        >同意</el-button
                      >
                    </template>
                  </el-popconfirm>

                  <el-popconfirm
                    width="220"
                    :title="`是否拒绝 ${scope.row.name} 的友链申请?`"
                    :icon="useRenderIcon(Warning)"
                    icon-color="#f56c6c"
                    @confirm="deleteBtn(scope.row)"
                  >
                    <template #reference>
                      <el-button
                        link
                        type="danger"
                        :icon="useRenderIcon(Close)"
                        size="small"
                        >拒绝</el-button
                      >
                    </template>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
      </el-tabs>

      <template #footer>
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 15, 20]"
          :small="true"
          background
          layout="->,total, sizes, prev, pager, next,jumper"
          :total="total"
          @size-change="getFriendLinkList"
          @current-change="getFriendLinkList"
        />
      </template>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      append-to-body
      title="修改友链"
      v-model="dialogVisible"
      width="30vw"
      :before-close="cancel"
    >
      <el-form :model="friendLink" ref="friendLinkFormRef" label-width="100px">
        <el-form-item
          label="网站名称"
          prop="name"
          :rules="[
            {
              required: true,
              message: '网站名称不能为空 !',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="friendLink.name"
            placeholder="请输入网站名称"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="网站描述"
          prop="description"
          :rules="[
            {
              required: true,
              message: '网站描述不能为空 !',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="friendLink.description"
            placeholder="请输入网站描述"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="网址"
          prop="link"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              message: '网址不能为空'
            }
          ]"
        >
          <el-input
            v-model="friendLink.link"
            placeholder="请输入网址"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="头像"
          :rules="[
            {
              required: true,
              message: '请上传头像 !',
              trigger: 'blur'
            }
          ]"
          prop="avatar"
        >
          <Upload
            @getFileList="getFileList"
            v-model:fileList="friendLinkImageList"
            :fileSize="2"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit(friendLinkFormRef)">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
