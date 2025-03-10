export default {
  path: "/information",
  meta: {
    title: "前台管理",
    rank: 8
  },
  children: [
    {
      path: "/information",
      name: "Information",
      component: () => import("@/views/foreground/index.vue"),
      meta: {
        title: "前台管理"
      }
    }
  ]
} as RouteConfigsTable;
