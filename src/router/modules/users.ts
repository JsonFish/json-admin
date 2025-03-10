export default {
  path: "/users",
  meta: {
    title: "用户管理",
    rank: 5
  },
  children: [
    {
      path: "/users",
      name: "Users",
      component: () => import("@/views/users/index.vue"),
      meta: {
        title: "用户管理"
      }
    }
  ]
};
