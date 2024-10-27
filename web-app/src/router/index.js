import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import middlewarePipeline from "./middleware/middlewarePipeline"
import {useAuthStore} from "src/stores/auth"
import { useUserStore } from 'src/stores/user';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const context = {
      to,
      from,
      next,
      isAuthenticated: authStore.isAuthenticated,
      usertype: userStore.user.userableType,
    };

    let middlewareSet = new Set()
    to.matched.forEach(match => {
      if (match.meta?.middleware)
        match.meta?.middleware.forEach(middleware => middlewareSet.add(middleware))
    })
    if (middlewareSet.size === 0) {
      return next();
    }

    const middlewares = Array.from(middlewareSet)

    return await middlewares[0]({
      ...context,
      next: middlewarePipeline(context, middlewares, 1),
    });
  });

  return Router
})
