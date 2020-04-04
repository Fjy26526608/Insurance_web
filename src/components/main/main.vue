<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden',float:'left'}">
          <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
            <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 Insurance  -->
            <div class="logo-con">
              <h2>I<span v-show="!collapsed">nsurance</span></h2>
              <!-- <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
              <img v-show="collapsed" :src="minLogo" key="min-logo" /> -->
            </div>
          </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :message-unread-count="unreadCount" :user-avatar="userAvatar"/>
          <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
          <!-- <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store> -->
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual, getMenuByRouter, copyArray } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'
import tx from '@/assets/images/tx.jpeg'
import Router from 'vue-router'
import Main from '@/components/main'
import parentView from '@/components/parent-view'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      menuList: this.$store.getters.menuList,
      insuranceTypesRoutes: [],
      currentTitle: ''
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvatar () {
      return tx
      // return this.$store.state.user.avatarImgPath
    },
    cacheList () {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    }
  },
  created() {
    const R = require('ramda')
    // 使用一份默认路由表的拷贝进行操作
    let routersCopy = R.clone(routers)
    this.fetchInsuranceTypes().then(() => {
      for (let i = 0; i < routersCopy.length; i++) {
        let item = routersCopy[i]
        if (item.name === 'insurance') {
          let children = item.children
          for (let j = 0; j < children.length; j++) {
            let innerRoute = children[j]
            if (innerRoute.name === '_enterprise') {
              let enterpriseChildren = innerRoute.children
              const enterpriseTypes = this.$store.getters.getEnterpiseInsuranceTypes
              console.log('/```````````/',enterpriseTypes)
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
              const personalTypes = this.$store.getters.getPersonalInsuranceTypes
              console.log('/~~~~~~~~~~~/',personalTypes)
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
      this.$router.addRoutes(routersCopy)
      this.$router.options.routes = routersCopy
      this.menuList = getMenuByRouter(routersCopy, this.$store.state.user.access)
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {})
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions([
      'handleLogin',
      'getUnreadMessageCount',
      'fetchInsuranceTypes'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    // 获取未读消息条数
    // this.getUnreadMessageCount()
  }
}
</script>
