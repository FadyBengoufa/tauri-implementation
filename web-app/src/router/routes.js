import redirectToSobcoAuth, { guest } from "src/router/middleware/auth";

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    name: "main",
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: "home",
        meta: {middleware: []},
      },
      {
        path: '/login',
        component: () => import('pages/login/LoginPage.vue'),
        name: "login",
        meta: {middleware: []},
      },
      {
        path: '/users',
        component: () => import('src/pages/user/ListUsersPage.vue'),
        name: "user-list",
        meta: {middleware: []},
      },
      {
        path: '/users/create',
        component: () => import('src/pages/user/UserForm.vue'),
        name: "user-create",
        meta: {middleware: []},
      },
      {
        path: '/users/:id/edit',
        component: () => import('src/pages/user/UserForm.vue'),
        name: "user-edit",
        meta: {middleware: []},
      },
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  // {
  //   path: '/:catchAll(.*)*',
  //   component: () => import('pages/ErrorNotFound.vue')
  // }
]

export default routes
