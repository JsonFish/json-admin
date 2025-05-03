<script setup lang="ts">
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Warning from "@iconify-icons/ep/warning";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import Hide from "@iconify-icons/ep/hide";
import View from "@iconify-icons/ep/view";
import type { TabsPaneContext } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { message } from "@/utils/message";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { QueryParams, ArticleInfo } from "@/api/article/type";
import { getArticle, deletArticle, updateStatus } from "@/api/article";

defineOptions({
  name: "ArticleManage"
});
// 查询参数
const queryParams = reactive<QueryParams>({
  title: "",
  page: 1,
  pageSize: 10,
  status: 0
});
const router = useRouter();
const total = ref<number>(0);
const articleList = ref<ArticleInfo[]>([]);
const loading = ref<boolean>(false);

onMounted(() => {
  getArticleLsit();
});
// 获取文章列表
const getArticleLsit = () => {
  loading.value = true;
  getArticle(queryParams).then(response => {
    articleList.value = response.data.articleList;
    total.value = response.data.total;
    loading.value = false;
  });
};

// 重置按钮
const reset = () => {
  queryParams.title = "";
  getArticleLsit();
};

// 切换tabs
const tabClick = (tabPane: TabsPaneContext) => {
  queryParams.status = tabPane.props.name as number;
  articleList.value = [];
  getArticleLsit();
};

// 编辑文章
const updateArticle = (id: number) => {
  router.push({ path: "/article/edit", query: { id } });
};

// 显示下架文章
const updateArticleStatus = (id: number) => {
  updateStatus({ id }).then(response => {
    if (response.code == 200) {
      message("操作成功", { type: "success" });
      getArticleLsit();
    } else {
      message(response.message, { type: "error" });
    }
  });
};

// 删除文章
const deleteBtn = (id: number) => {
  deletArticle({ id }).then(response => {
    if (response.code == 200) {
      message("删除成功", { type: "success" });
      getArticleLsit();
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
        <div class="card-header">
          <span>文章管理</span>
          <el-button
            @click="router.push('/article/edit')"
            :icon="useRenderIcon(EditPen)"
            type="primary"
            text
            size="small"
            >写文章</el-button
          >
        </div>
      </template>
      <el-row>
        <el-form :model="queryParams" :inline="true" ref="queryFormRef">
          <el-form-item label="标题">
            <el-input
              v-model="queryParams.title"
              placeholder="请输入文章标题"
              prop="title"
              size="small"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              :disabled="!queryParams.title"
              type="primary"
              :icon="useRenderIcon(Search)"
              @click="getArticleLsit"
              size="small"
              >搜索</el-button
            >
            <el-button
              type="info"
              :icon="useRenderIcon(Refresh)"
              @click="reset"
              size="small"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </el-row>
      <el-tabs :model-value="0" @tab-click="tabClick">
        <el-tab-pane label="已发布" :name="0">
          <el-table
            stripe
            border
            :data="articleList"
            v-loading="loading"
            style="height: calc(100vh - 375px)"
          >
            <el-table-column type="index" align="center" label="#" width="40" />
            <el-table-column
              align="center"
              prop="title"
              label="文章标题"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              align="center"
              prop="description"
              label="摘要"
              show-overflow-tooltip
              width="250"
            />
            <el-table-column
              align="center"
              prop="tags"
              label="标签"
              min-width="210"
            >
              <template #default="scope">
                <el-tag
                  style="margin: 3px"
                  v-for="(tag, index) in scope.row.tags"
                  :key="index"
                >
                  {{ tag.tagName }}
                </el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" prop="categoryName" label="分类">
              <template #default="scope">
                <el-tag> {{ scope.row.categoryName }} </el-tag>
              </template>
            </el-table-column> -->
            <el-table-column align="center" prop="isTop" label="置顶">
              <template #default="scope">
                {{ scope.row.isTop == 0 ? "未置顶" : scope.row.isTop }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="views" label="浏览量" />
            <el-table-column
              align="center"
              prop="createTime"
              label="创建时间"
              min-width="160"
            />
            <el-table-column
              align="center"
              prop="updateTime"
              label="修改时间"
              min-width="160"
            />
            <el-table-column label="操作" min-width="190">
              <template #default="scope">
                <div class="btnClass">
                  <el-button
                    @click="updateArticle(scope.row.id)"
                    link
                    type="primary"
                    size="small"
                    :icon="useRenderIcon(EditPen)"
                    >修改</el-button
                  >
                  <el-popconfirm
                    width="250"
                    :title="`是否下架此文章?`"
                    :icon="useRenderIcon(Hide)"
                    @confirm="updateArticleStatus(scope.row.id)"
                    icon-color="#f3d6a9"
                  >
                    <template #reference>
                      <el-button
                        size="small"
                        link
                        type="warning"
                        :icon="useRenderIcon(Hide)"
                        >下架</el-button
                      >
                    </template>
                  </el-popconfirm>
                  <el-popconfirm
                    width="250"
                    :title="`是否删除文章: ${scope.row.title} ?`"
                    :icon="useRenderIcon(Warning)"
                    @confirm="deleteBtn(scope.row.id)"
                    icon-color="#f56c6c"
                  >
                    <template #reference>
                      <el-button
                        link
                        size="small"
                        type="danger"
                        :icon="useRenderIcon(Delete)"
                        >删除</el-button
                      >
                    </template>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="草稿箱" :name="1">
          <el-table
            stripe
            border
            :data="articleList"
            v-loading="loading"
            style="height: calc(100vh - 375px)"
          >
            <el-table-column type="index" align="center" label="#" width="40" />
            <el-table-column
              align="center"
              prop="title"
              label="文章标题"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              align="center"
              prop="description"
              label="摘要"
              show-overflow-tooltip
              width="250"
            />
            <el-table-column
              align="center"
              prop="tags"
              label="标签"
              min-width="210"
            >
              <template #default="scope">
                <el-tag
                  style="margin: 3px"
                  v-for="(tag, index) in scope.row.tags"
                  :key="index"
                >
                  {{ tag.tagName }}
                </el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" prop="categoryName" label="分类">
              <template #default="scope">
                <el-tag> {{ scope.row.categoryName }} </el-tag>
              </template>
            </el-table-column> -->
            <el-table-column align="center" prop="isTop" label="置顶">
              <template #default="scope">
                {{ scope.row.isTop == 0 ? "未置顶" : scope.row.isTop }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="views" label="浏览量" />
            <el-table-column
              align="center"
              prop="createTime"
              label="创建时间"
              min-width="160"
            />
            <el-table-column
              align="center"
              prop="updateTime"
              label="修改时间"
              min-width="160"
            />
            <el-table-column label="操作" min-width="190">
              <template #default="scope">
                <div class="btnClass">
                  <el-button
                    @click="updateArticle(scope.row.id)"
                    link
                    type="primary"
                    size="small"
                    :icon="useRenderIcon(EditPen)"
                    >修改</el-button
                  >
                  <el-popconfirm
                    width="250"
                    :title="`是否上架此文章?`"
                    :icon="useRenderIcon(View)"
                    @confirm="updateArticleStatus(scope.row.id)"
                    icon-color="#f3d6a9"
                  >
                    <template #reference>
                      <el-button
                        size="small"
                        link
                        type="warning"
                        :icon="useRenderIcon(View)"
                        >上架</el-button
                      >
                    </template>
                  </el-popconfirm>
                  <el-popconfirm
                    width="250"
                    :title="`是否删除此文章?`"
                    :icon="useRenderIcon(Warning)"
                    @confirm="deleteBtn(scope.row.id)"
                    icon-color="#f56c6c"
                  >
                    <template #reference>
                      <el-button
                        link
                        size="small"
                        type="danger"
                        :icon="useRenderIcon(Delete)"
                        >删除</el-button
                      >
                    </template>
                  </el-popconfirm>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[5, 10, 20]"
          :small="true"
          background
          layout="->,total, sizes, prev, pager, next,jumper"
          :total="total"
          @size-change="getArticleLsit"
          @current-change="getArticleLsit"
        />
      </template>
    </el-card>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}
</style>
