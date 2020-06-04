import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

const routeOptions = [
  { path: "/", component: "Home" },
  { path: "/home", component: "Home" },
  { path: "/cut", component: "cut" },
  { path: "/merge", component: "Merge" },
  { path: "/about", component: "About" },
  { path: "/ptgen", component: "PTGen" },
  { path: "/m3u8", component: "M3U8" },
  { path: "/setting", component: "Setting" }
]

const routes = routeOptions.map(route => {
  return {
    ...route,
    component: () =>
      import(`../pages/${route.component}/${route.component}.vue`)
  }
})

export default new Router({
  routes: routes,
  mode: "hash"
})
