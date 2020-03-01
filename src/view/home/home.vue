<template>
  <div>
    <Card :padding="0" shadow class="text-center">
      <button :class="{ active: changeType === 1 }" @click="changeTopTab(1)" class="top_tab_button">企业</button>
      <button :class="{ active: changeType === 2 }" @click="changeTopTab(2)" class="top_tab_button">个人</button>
    </Card>
    <div class="parentPosition" v-if="show">
      <Spin v-show="hasShowSpin" size="large" :fix="true"></Spin>
      <Row :gutter="20" class="mt20">
        <i-col span="12">
          <Card shadow>
            <div class="table-card-title">
              <h3 class="pull-left">近期保险到期（10天以内）</h3>
              <router-link class="pull-right" :to="{path:'/insurance/enterprise/allDatec', query: { type: 10 }}">查看更多
              </router-link>
            </div>
            <Table :loading="loading" :row-class-name="rowClassName" size="large" border stripe :columns="ctableTitle"
              :data="ctableDet10" max-height="720" style="width:100%" @on-row-dblclick="cdet"></Table>
            <!-- <table class="table-card-box mt20" cellpadding="0" cellspacing="0" ></table>-->
          </Card>
        </i-col>
        <i-col span="12">
          <Card shadow>
            <div class="table-card-title">
              <h3 class="pull-left">近期保险到期（10~15天）</h3>
              <router-link class="pull-right" :to="{path:'/insurance/enterprise/allDatec', query: { type: 15 }}">查看更多
              </router-link>
            </div>
            <Table :loading="loading" size="large" border stripe :columns="ctableTitle" :data="ctableDet15"
              max-height="720" style="width:100%" @on-row-dblclick="cdet"></Table>
            <!-- <table class="table-card-box mt20" cellpadding="0" cellspacing="0"></table> -->
          </Card>
        </i-col>
      </Row>
    </div>
    <div class="parentPosition" v-if="!show">
      <Spin v-show="hasShowSpin" size="large" :fix="true"></Spin>
      <Row :gutter="20" class="mt20">
        <i-col span="12">
          <Card shadow>
            <div class="table-card-title">
              <h3 class="pull-left">近期保险到期（10天以内）</h3>
              <router-link class="pull-right" :to="{path:'/insurance/personal/allDatep', query: { type: 10 }}">查看更多
              </router-link>
            </div>
            <Table :loading="loading" size="large" border stripe :columns="ptableTitle" :data="ptableDet10"
              max-height="720" style="width:100%" @on-row-dblclick="pdet"></Table>
            <!-- <table class="table-card-box mt20" cellpadding="0" cellspacing="0" ></table>-->
          </Card>
        </i-col>
        <i-col span="12">
          <Card shadow>
            <div class="table-card-title">
              <h3 class="pull-left">近期保险到期（10~15天）</h3>
              <router-link class="pull-right" :to="{path:'/insurance/personal/allDatep', query: { type: 15 }}">查看更多
              </router-link>
            </div>
            <Table :loading="loading" size="large" border stripe :columns="ptableTitle" :data="ptableDet15"
              max-height="720" style="width:100%" @on-row-dblclick="pdet"></Table>
            <!-- <table class="table-card-box mt20" cellpadding="0" cellspacing="0"></table> -->
          </Card>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/libs/util'
// import axios from 'axios'
import axios from '@/libs/api.request'
export default {
  name: 'home',
  data() {
    return {
      changeType: 1,
      hasShowSpin: false,
      loading: true,
      ctableTitle: [
        {
          title: '编号',
          key: 'contractnum',
          align: 'center',
          tooltip: true
        },
        {
          title: '名称',
          key: 'insured',
          align: 'center',
          tooltip: true
        },
        {
          title: '到期时间',
          key: 'reminddate',
          align: 'center',
          tooltip: true
        }
      ],
      ptableTitle: [
        {
          title: '编号',
          key: 'contractnum',
          align: 'center',
          tooltip: true
        },
        {
          title: '姓名',
          key: 'insured',
          align: 'center',
          tooltip: true
        },
        {
          title: '到期时间',
          key: 'reminddate',
          align: 'center',
          tooltip: true
        },
        {
          title: '待补金额',
          key: 'policyamount',
          align: 'center',
          tooltip: true
        }
      ],
      ctableDet10: [],
      ctableDet15: [],
      ptableDet10: [],
      ptableDet15: [],
      show: true
    }
  },
  beforeCreate() {
    console.log('创建前：')
  },
  created() {
    console.log('创建完成')
    this.loading = true
    this.ctableDet10 = []
    this.ctableDet15 = []
    let that = this
    console.log('值', that)
    console.log('token值', getToken())
    axios.request({
      method: 'post',
      url: '/main/maturitylist10',
      headers: {
        token: getToken(),
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        page: 1,
        pagesize: 15,
        iscompany: true
      }
    }).then(function (res) {
      for (let i = 0; i < res.data.data.length; i++) {
        let indexs = res.data.data[i].reminddate.reminddate.indexOf('T')
        that.ctableDet10.push(res.data.data[i])
        that.ctableDet10[i].reminddate = res.data.data[i].reminddate.reminddate.slice(0, indexs)
      }
    }).catch(function (error) {
      console.log(error)
    })
    axios.request({
      method: 'post',
      url: '/main/maturitylist15',
      headers: {
        token: getToken(),
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        page: 1,
        pagesize: 15,
        iscompany: true
      }
    }).then(function (res) {
      for (let i = 0; i < res.data.data.length; i++) {
        let indexs = res.data.data[i].reminddate.reminddate.indexOf('T')
        that.ctableDet15.push(res.data.data[i])
        that.ctableDet15[i].reminddate = res.data.data[i].reminddate.reminddate.slice(0, indexs)
      }
    }).catch(function (error) {
      console.log(error)
    })
    this.loading = false
  },
  beforeMount() {
    console.log('挂载前：')
  },
  mounted() {
    console.log('挂载完成：')
  },
  beforeUpdate() {
    console.log('即将更新渲染')
  },
  updated() {
    console.log('更新渲染成功')
  },

  methods: {
    changeTopTab(type) {
      // 切换类型
      this.ptableDet10 = []
      this.ptableDet15 = []
      let that = this
      axios.request({
        method: 'post',
        url: '/main/maturitylist10',
        headers: {
          token: getToken(),
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          page: 1,
          pagesize: 15,
          iscompany: false
        }
      }).then(function (res) {
        for (let i = 0; i < res.data.data.length; i++) {
          let indexs = res.data.data[i].reminddate.indexOf('T')
          that.ptableDet10.push(res.data.data[i])
          that.ptableDet10[i].reminddate = res.data.data[i].reminddate.slice(0, indexs)
        }
      }).catch(function (error) {
        console.log(error)
      })
      axios.request({
        method: 'post',
        url: '/main/maturitylist15',
        headers: {
          token: getToken(),
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          page: 1,
          pagesize: 15,
          iscompany: false
        }
      }).then(function (res) {
        for (let i = 0; i < res.data.data.length; i++) {
          let indexs = res.data.data[i].reminddate.indexOf('T')
          that.ptableDet15.push(res.data.data[i])
          console.log(that.ptableDet15)
          that.ptableDet15[i].reminddate = res.data.data[i].reminddate.slice(0, indexs)
        }
      }).catch(function (error) {
        console.log(error)
      })
      this.changeType = type
      if (type === 1) {
        this.show = true
      } else {
        this.show = false
      }
      this.hasShowSpin = true
      setTimeout(() => {
        this.hasShowSpin = false
      }, 500)
    },
    cdet(e, index) {
      console.log('我的下标是', index, e)
      this.$router.push({ path: '/insurance/enterprise/cdet' })
    },
    pdet(e, index) {
      console.log('我的下标是', index, e)
      this.$router.push({
        path: '/insurance/personal/pdet',
        query: { id: e.id }
      })
    },
    rowClassName(row, index) {
      if (index === 0) {
        return 'demo-table-y-row'
      } else if (index === 1) {
        return 'demo-table-y-row'
      }
      return ''
    }
  }
}
</script>

<style lang='less'>
  .count-style {
    font-size: 50px;
  }

  .top_tab_button {
    outline: none;
    border: none;
    background: none;
    width: 120px;
    height: 46px;
    font-size: 18px;
  }

  .top_tab_button.active {
    color: rgb(45, 140, 240);
    border-bottom: 2px solid rgb(45, 140, 240);
  }

  .table-card-title {
    height: 20px;
  }

  .table-card-title h3 {
    color: rgb(45, 140, 240);
  }

  .table-card-title a {
    margin-top: 3px;
  }

  .table-card-box {
    width: 100%;
    border-collapse: collapse;
  }

  .table-card-box thead td {
    color: #fff;
    background: rgba(45, 140, 240, 1);
  }

  .table-card-box td {
    width: 20%;
    text-align: center;
    height: 36px;
    border: 1px solid #ececec;
  }

  .parentPosition {
    position: relative;
  }

  .ivu-table .demo-table-y-row td {
    background-color: rgba(255, 255, 0, 0.5);
    color: rgb(0, 0, 0);
  }

  .ivu-table .demo-table-r-row td {
    background-color: rgb(255, 0, 0,0.5);
    color: rgb(0, 0, 0);
  }
</style>
