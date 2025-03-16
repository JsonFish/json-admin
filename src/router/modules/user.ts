export default {
  path: "/users",
  meta: {
    title: "用户管理",
    rank: 5
  },
  children: [
    {
      path: "/user",
      name: "User",
      component: () => import("@/views/user/index.vue"),
      meta: {
        title: "用户管理"
      }
    }
  ]
};
