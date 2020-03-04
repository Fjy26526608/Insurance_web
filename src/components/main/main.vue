<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden',float:'left'}">
          <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
            <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
            <div class="logo-con">
              <h2>C<span v-show="!collapsed">harlie</span></h2>
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
      return this.$store.state.user.avatarImgPath
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
    this.fetchInsuranceTypes().then(() => {
      // 重置当前路由表为默认静态路由
      this.$router.match = new Router({ routers, mode: 'history' }).match
      console.log(routers)
      // 使用一份默认路由表的拷贝进行操作
      let routersCopy = copyArray(routers)
      console.log(routersCopy)
      for (let i = 0; i < routersCopy.length; i++) {
        let item = routersCopy[i]
        if (item.name === 'insurance') {
          let children = item.children
          for (let j = 0; j < children.length; j++) {
            let innerRoute = children[j]
            if (innerRoute.name === '_enterprise') {
              let enterpriseChildren = innerRoute.children
              const enterpriseTypes = this.$store.getters.getEnterpiseInsuranceTypes
              for (const type of enterpriseTypes) {
                enterpriseChildren.push({
                  path: 'index/' + type.id,
                  name: '企业-' + type.name,
                  meta: {
                    icon: 'md-options',
                    title: '企业-' + type.name
                  },
                  props: {
                    typeId: type.id
                  },
                  component: () =>
                    import('@/view/insurance/enterprise/index/index.vue')
                })
                this.$router.addRoutes([{
                  path: '/insurance',
                  name: 'insurance',
                  meta: {
                    icon: 'md-menu',
                    title: '保险管理',
                    showAlways: true
                  },
                  component: Main,
                  children: [
                    {
                      path: 'enterprise',
                      name: '_enterprise',
                      meta: {
                        icon: 'md-briefcase',
                        showAlways: true,
                        title: '企业'
                      },
                      component: parentView,
                      redirect: { name: 'enterprise' },
                      children: [{
                        path: 'index/' + type.id,
                        name: '企业-' + type.name,
                        meta: {
                          icon: 'md-options',
                          title: '企业-' + type.name
                        },
                        props: {
                          typeId: type.id
                        },
                        component: () =>
                          import('@/view/insurance/enterprise/index/index.vue')
                      }]
                    }
                  ]
                }])
              }
            } else if (innerRoute.name === '_personal') {
              let personalChildren = innerRoute.children
              const personalTypes = this.$store.getters.getPersonalInsuranceTypes
              for (const type of personalTypes) {
                personalChildren.push({
                  path: 'index/' + type.id,
                  name: '个人-' + type.name,
                  meta: {
                    icon: 'md-options',
                    title: '个人-' + type.name
                  },
                  props: {
                    typeId: type.id
                  },
                  component: () =>
                    import('@/view/insurance/personal/index/index')
                })
                this.$router.addRoutes([{
                  path: '/insurance',
                  name: 'insurance',
                  meta: {
                    icon: 'md-menu',
                    title: '保险管理',
                    showAlways: true
                  },
                  component: Main,
                  children: [
                    {
                      path: 'personal',
                      name: '_personal',
                      meta: {
                        access: [],
                        icon: 'ios-people-outline',
                        showAlways: true,
                        title: '个人'
                      },
                      redirect: { name: 'personal' },
                      component: parentView,
                      children: [{
                        path: 'index/' + type.id,
                        name: '个人-' + type.name,
                        meta: {
                          icon: 'md-options',
                          title: '个人-' + type.name
                        },
                        props: {
                          typeId: type.id
                        },
                        component: () =>
                          import('@/view/insurance/personal/index/index')
                      }]
                    }
                  ]
                }])
              }
            }
          }
        }
      }
      this.menuList = getMenuByRouter(routersCopy, this.$store.state.user.access)
    })
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
      // 根据name查询对应的路由参数，如果存在则拼接上
      const insuranceRoute = this.insuranceTypesRoutes.find(r => r.name === name)
      if (insuranceRoute) {
        this.currentTitle = name
        const { path, params } = insuranceRoute
        this.$router.push({
          path,
          query: params
        })
      } else {
        if (name.indexOf('isTurnByHref_') > -1) {
          window.open(name.split('_')[1])
        }
        this.$router.push({
          name,
          params,
          query
        })
      }
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
