import Document from "@iconify-icons/ri/article-line";
import Edit from "@iconify-icons/ri/file-edit-line";
export default {
  path: "/article",
  redirect: "/article/manage",
  meta: {
    title: "文章管理",
    rank: 1
  },
  children: [
    {
      path: "/article/manage",
      name: "ArticleManage",
      component: () => import("@/views/article/index.vue"),
      meta: {
        title: "管理文章",
        icon: Document
      }
    },
    {
      path: "/article/edit",
      name: "EditArticle",
      component: () => import("@/views/editArticle/index.vue"),
      meta: {
        title: "编辑文章",
        icon: Edit,
        showLink: true
      }
    }
  ]
} as RouteConfigsTable;
