export default {
  path: "/daily",
  meta: {
    title: "日常管理",
    rank: 2
  },
  children: [
    {
      path: "/daily",
      name: "Daily",
      component: () => import("@/views/daily/index.vue"),
      meta: {
        title: "日常管理"
      }
    }
  ]
};
