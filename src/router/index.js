import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

const regenRoutes = (to, from, next) => {
  const R = require('ramda')
  // 使用一份默认路由表的拷贝进行操作
  let routersCopy = R.clone(routes)
  store.dispatch('fetchInsuranceTypes').then(() => {
    for (let i = 0; i < routersCopy.length; i++) {
      let item = routersCopy[i]
      if (item.name === 'insurance') {
        let children = item.children
        for (let j = 0; j < children.length; j++) {
          let innerRoute = children[j]
          if (innerRoute.name === '_enterprise') {
            let enterpriseChildren = innerRoute.children
            const enterpriseTypes = store.getters.getEnterpiseInsuranceTypes
            for (const type of enterpriseTypes) {
              if (type.child && type.child.length > 0) {
                const child = [{
                  path: 'index/' + type.id,
                  name: '所有' + type.name,
                  meta: {
                    icon: 'md-options',
                    title: '所有' + type.name
                  },
                  props: {
                    typeId: type.id
                  },
                  component: () =>
                    import('@/view/insurance/enterprise/index/index')
                }]
                for (const item of type.child) {
                  child.push({
                    path: 'child/' + item.id,
                    name: item.name,
                    meta: {
                      icon: 'md-options',
                      title: item.name
                    },
                    props: {
                      typeId: item.id
                    },
                    component: () =>
                      import('@/view/insurance/enterprise/child/child')
                  })
                }
                enterpriseChildren.push({
                  path: 'index/' + type.id,
                  name: type.name,
                  meta: {
                    icon: 'md-options',
                    title: type.name
                  },
                  props: {
                    typeId: type.id
                  },
                  component: () =>
                    import('@/view/insurance/enterprise/index/index'),
                  children: child
                })
              } else {
                enterpriseChildren.push({
                  path: 'index/' + type.id,
                  name: type.name,
                  meta: {
                    icon: 'md-options',
                    title: type.name
                  },
                  props: {
                    typeId: type.id
                  },
                  component: () =>
                  import('@/view/insurance/enterprise/index/index.vue')
                })
              }
            }
          } else if (innerRoute.name === '_personal') {
            let personalChildren = innerRoute.children
            const personalTypes = store.getters.getPersonalInsuranceTypes
            for (const type of personalTypes) {
              if (type.child && type.child.length > 0) {
                const child = [{
                  path: 'index/' + type.id,
                  name: '所有' + type.name,
                  meta: {
                    icon: 'md-options',
                    title: '所有' + type.name
                  },
                  props: {
                    typeId: type.id
                  },
                  component: () =>
                    import('@/view/insurance/personal/index/index')
                }]
                for (const item of type.child) {
                  child.push({
                    path: 'child/' + item.id,
                    name: item.name,
                    meta: {
                      icon: 'md-options',
                      title: item.name
                    },
                    props: {
                      typeId: item.id
                    },
                    component: () =>
                      import('@/view/insurance/personal/child/child')
                  })
                }
                personalChildren.push({
                  path: 'index/' + type.id,
                  name: type.name,
                  meta: {
                    icon: 'md-options',
                    title: type.name
                  },
                  props: {
                    typeId: type.id
                  },
                  component: () =>
                    import('@/view/insurance/personal/index/index'),
                  children: child
                })
              } else {
                personalChildren.push({
                  path: 'index/' + type.id,
                  name: type.name,
                  meta: {
                    icon: 'md-options',
                    title: type.name
                  },
                  props: {
                    typeId: type.id
                  },
                  component: () =>
                    import('@/view/insurance/personal/index/index')
                })
              }
            }
          }
        }
      }
    }
    routersCopy.push(
      {
        path: '*',
        name: 'error_404',
        meta: {
          hideInMenu: true
        },
        component: () => import('@/view/error-page/404.vue')
      }
    )
    router.addRoutes(routersCopy)
    router.options.routes = routersCopy
    if (to.matched.length === 0) {
      next({ ...to, replace: true })
    } else {
      next()
    }
  })
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    if (store.state.user.hasGetInfo) {
      // FIXME 你TM没权限就不要显示了啊傻逼，操你妈显示出来还不让人跳转，是TM低能还是怎样，操你妈想好再做
      // turnTo(to, store.state.user.access, next)
      if (from.name == null) {
        regenRoutes(to, from, next)
      } else {
        next()
      }
    } else {
      store.dispatch('getUserInfo').then(user => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        // FIXME 你TM没权限就不要显示了啊傻逼，操你妈显示出来还不让人跳转，是TM低能还是怎样，操你妈想好再做
        // turnTo(to, user.access, next)
        if (from.name == null) {
          regenRoutes(to, from, next)
        } else {
          next()
        }
      }).catch(() => {
        setToken('')
        next({
          name: 'login'
        })
      })
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
