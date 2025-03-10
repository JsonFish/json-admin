export default {
  path: "/friendLink",
  meta: {
    title: "友链管理",
    rank: 4
  },
  children: [
    {
      path: "/friendLink",
      name: "FriendLink",
      component: () => import("@/views/friendLink/index.vue"),
      meta: {
        title: "友链管理"
      }
    }
  ]
} as RouteConfigsTable;
