<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import routers from '@/router/routers'
import Router from 'vue-router'
export default {
  components: {
    LoginForm
  },
  created() {
    // 重置路由
    this.$router.options.routes = routers
    // 重置当前路由表为默认静态路由
    this.$router.match = new Router({ routers, mode: 'history' }).match
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),
    // ...mapActions(['handleLogin']),
    handleSubmit({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        this.getUserInfo().then(res => {
          console.log('登录跳转', res)
          console.log('登录跳转', this.$config.homeName)
          this.$router.push({
            name: this.$config.homeName
          })
        })
      })
    }
  }
}
</script>

<style>
</style>
