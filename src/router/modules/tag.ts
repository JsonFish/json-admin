export default {
  path: "/tag",
  meta: {
    title: "标签管理",
    rank: 2
  },
  children: [
    {
      path: "/tag",
      name: "Tag",
      component: () => import("@/views/tag/index.vue"),
      meta: {
        title: "标签管理"
      }
    }
  ]
};
