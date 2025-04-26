<script setup lang="ts">
import Delete from "@iconify-icons/ep/delete";
import Warning from "@iconify-icons/ep/warning";
import Check from "@iconify-icons/ep/check";
import Close from "@iconify-icons/ep/close";
import Reply from "@iconify-icons/ep/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { onMounted, ref, reactive } from "vue";
import { getMessage, approvalMessage, deleteMessage } from "@/api/message";
import type { QueryParams, MessageInfo } from "@/api/message/type";
import type { TabsPaneContext } from "element-plus";
import { message } from "@/utils/message";
defineOptions({
  name: "Message"
});
const queryParams = reactive<QueryParams>({
  page: 1,
  pageSize: 20,
  status: 1
});
const total = ref<number>(0);
const loading = ref<boolean>(false);
const messageList = ref<any[]>();

onMounted(() => {
  getMessageList();
});

// 获取留言
const getMessageList = () => {
  loading.value = true;
  getMessage(queryParams).then(response => {
    messageList.value = response.data.messageList;
    total.value = response.data.total;
    loading.value = false;
  });
};

// 切换tabs
const tabClick = (tabPane: TabsPaneContext) => {
  queryParams.status = tabPane.props.name as number;
  getMessageList();
};

// 删除按钮回调
const deleteBtn = (row: MessageInfo | any) => {
  deleteMessage({ id: row.id }).then(response => {
    if (response.code == 200) {
      message("删除成功", { type: "success" });
      getMessageList();
    } else {
      message(response.message, { type: "error" });
    }
  });
};
// 同意留言
const agreeApply = (row: MessageInfo) => {
  approvalMessage(row.id).then(response => {
    if (response.code == 200) {
      message("操作成功", { type: "success" });
      getMessageList();
    } else {
      message(response.message, { type: "error" });
    }
  });
};
</script>

<template>
  <div>
    <el-card>
      <template #header>
        <div>留言管理</div>
      </template>
      <el-tabs :model-value="1" @tab-click="tabClick">
        <el-tab-pane label="审核通过" :name="1">
          <el-table
            size="small"
            stripe
            v-loading="loading"
            :data="messageList"
            border
            style="height: calc(100vh - 325px)"
          >
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column type="index" align="center" label="#" width="50" />
            <el-table-column
              prop="username"
              align="center"
              label="用户名"
              width="150"
            />
            <el-table-column
              prop="avatar"
              label="用户头像"
              align="center"
              width="100"
            >
              <template v-slot="scope">
                <el-avatar :src="scope.row.avatar" />
              </template>
            </el-table-column>
            <el-table-column
              prop="email"
              align="center"
              label="用户邮箱"
              width="150"
            >
              <template v-slot="scope">
                {{ scope.row.email || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ip_address"
              align="center"
              label="ip属地"
              width="150"
            >
              <template v-slot="scope">
                {{ scope.row.ipAddress || "-" }}
              </template>
            </el-table-column>

            <el-table-column
              prop="text"
              align="center"
              label="留言内容"
              min-width="200"
            />
            <el-table-column
              prop="createTime"
              align="center"
              label="留言时间"
              width="200"
            />
            <el-table-column label="操作" width="250">
              <template #default="scope">
                <el-button
                  size="small"
                  link
                  type="primary"
                  :icon="useRenderIcon(Reply)"
                >
                  回复
                </el-button>
                <el-popconfirm
                  width="250"
                  :title="`是否删除用户 ${scope.row.username} 的留言 ?`"
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
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
        <el-tab-pane label="待审核" :name="0">
          <el-table
            size="small"
            v-loading="loading"
            :data="messageList"
            border
            style="height: calc(100vh - 325px)"
          >
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column type="index" align="center" label="#" width="50" />
            <el-table-column
              prop="username"
              align="center"
              label="用户名"
              width="150"
            />
            <el-table-column
              prop="avatar"
              label="用户头像"
              align="center"
              width="100"
            >
              <template v-slot="scope">
                <el-avatar :src="scope.row.avatar" />
              </template>
            </el-table-column>
            <el-table-column
              prop="email"
              align="center"
              label="用户邮箱"
              width="150"
            >
              <template v-slot="scope">
                {{ scope.row.email || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ip_address"
              align="center"
              label="ip地址"
              width="150"
            >
              <template v-slot="scope">
                {{ scope.row.ipAddress || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="text"
              align="center"
              label="留言内容"
              min-width="200"
            />
            <el-table-column
              prop="createTime"
              align="center"
              label="留言时间"
              width="200"
            />
            <el-table-column label="操作" width="250">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  @click="agreeApply(scope.row)"
                  size="small"
                  :icon="useRenderIcon(Check)"
                  >通过</el-button
                >
                <el-popconfirm
                  width="250"
                  :title="`是否删除 ${scope.row.username} 的留言?`"
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
                      >删除</el-button
                    >
                  </template>
                </el-popconfirm>
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
          @size-change="getMessageList"
          @current-change="getMessageList"
        />
      </template>
    </el-card>
  </div>
</template>
