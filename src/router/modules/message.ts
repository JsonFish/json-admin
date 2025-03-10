export default {
  path: "/messgae",
  meta: {
    title: "留言管理",
    rank: 3
  },
  children: [
    {
      path: "/messgae",
      name: "Messgae",
      component: () => import("@/views/message/index.vue"),
      meta: {
        title: "留言管理"
      }
    }
  ]
};
