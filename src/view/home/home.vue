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
              <router-link class="pull-right" :to="{path:'/insurance/enterprise/allDatec', query: { type: 10 }}">查看更多</router-link>
            </div>
            <Table :loading="loading" size="large" border stripe :columns="ctableTitle" :data="ctableDet10" max-height="720" style="width:100%" @on-row-dblclick="cdet"></Table>
            <!-- <table class="table-card-box mt20" cellpadding="0" cellspacing="0" ></table>-->
          </Card>
        </i-col>
        <i-col span="12">
          <Card shadow>
            <div class="table-card-title">
              <h3 class="pull-left">近期保险到期（10~15天）</h3>
              <router-link class="pull-right" :to="{path:'/insurance/enterprise/allDatec', query: { type: 15 }}">查看更多</router-link>
            </div>
            <Table :loading="loading"  size="large" border stripe :columns="ctableTitle" :data="ctableDet15" max-height="720" style="width:100%" @on-row-dblclick="cdet"></Table>
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
              <router-link class="pull-right" :to="{path:'/insurance/personal/allDatep', query: { type: 10 }}">查看更多</router-link>
            </div>
            <Table :loading="loading"  size="large" border stripe :columns="ptableTitle" :data="ptableDet10" max-height="720" style="width:100%" @on-row-dblclick="pdet"></Table>
            <!-- <table class="table-card-box mt20" cellpadding="0" cellspacing="0" ></table>-->
          </Card>
        </i-col>
        <i-col span="12">
          <Card shadow>
            <div class="table-card-title">
              <h3 class="pull-left">近期保险到期（10~15天）</h3>
              <router-link class="pull-right" :to="{path:'/insurance/personal/allDatep', query: { type: 15 }}">查看更多</router-link>
            </div>
            <Table :loading="loading"  size="large" border stripe :columns="ptableTitle" :data="ptableDet15" max-height="720" style="width:100%" @on-row-dblclick="pdet"></Table>
            <!-- <table class="table-card-box mt20" cellpadding="0" cellspacing="0"></table> -->
          </Card>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/libs/util'
import axios from 'axios'
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
          title: '日期',
          key: 'date',
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
          title: '金额',
          key: 'money',
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
          title: '日期',
          key: 'date',
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
          title: '金额',
          key: 'money',
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
    console.log('创建完成：')
    this.loading = true
    console.log('token值', getToken())
    function getc10() {
      return axios({
        method: 'post',
        url: 'http://47.105.49.81:2222/main/maturitylist10',
        headers: {
          token: getToken(),
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          // 'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
        },
        data: {
          pagem: 1,
          pagesize: 15,
          iscompany: true
        }
      }).then(function (response) {
        console.log(response)
      }).catch(function (error) {
        console.log(error)
      })
    }
    function getc15() {
      return axios({
        method: 'post',
        url: 'http://47.105.49.81:2222/main/maturitylist15',
        headers: {
          token: getToken(),
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          pagem: 1,
          pagesize: 15,
          iscompany: true
        }
      }).then(function (response) {
        console.log(response)
      }).catch(function (error) {
        console.log(error)
      })
    }
    axios.all([getc10(), getc15()])
      .then(axios.spread(function (c10, c15) {
        // 两个请求现在都执行完成
        console.log('同时请求完成', c10, c15)
      }))
    // axios({
    //   method: 'post',
    //   url: 'http://47.105.49.81:2222/main/maturitylist10',
    //   headers: {
    //     token: getToken(),
    //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    //   },
    //   data: {
    //     pagem: 1,
    //     pagesize: 15,
    //     iscompany: true
    //   }
    // }).then(function (response) {
    //   console.log(response)
    // }).catch(function (error) {
    //   console.log(error)
    // })
    let tc = [
      {
        id: 11111,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 22222,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 33333,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 44444,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 55555,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 66666,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 77777,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 88888,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 99999,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      }
    ]
    let tc15 = [
      {
        id: 1010,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 1111,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 1212,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 1313,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 1414,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 1515,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 1616,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 1717,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 1818,
        name: '山东新华电脑学院东校区',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      }
    ]
    let tp = [
      {
        id: 1,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 2,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 3,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 4,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 5,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 6,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 7,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 8,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 9,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      }
    ]
    let tp15 = [
      {
        id: 10,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 11,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 12,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 13,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 14,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 15,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 16,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 17,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      },
      {
        id: 18,
        name: '路人甲',
        date: '2018-8-8',
        stopDate: '2019-8-8',
        money: 1999
      }
    ]
    for (let i = 0; i < 8; i++) {
      this.ctableDet10.push(tc[i])
      this.ptableDet10.push(tp[i])
      this.ctableDet15.push(tc15[i])
      this.ptableDet15.push(tp15[i])
    }
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
      function getc10() {
        return axios({
          method: 'post',
          url: 'http://47.105.49.81:2222/main/maturitylist10',
          headers: {
            token: getToken(),
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          data: {
            pagem: 1,
            pagesize: 15,
            iscompany: false
          }
        }).then(function (response) {
          console.log(response)
        }).catch(function (error) {
          console.log(error)
        })
      }
      function getc15() {
        return axios({
          method: 'post',
          url: 'http://47.105.49.81:2222/main/maturitylist15',
          headers: {
            token: getToken(),
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          data: {
            pagem: 1,
            pagesize: 15,
            iscompany: false
          }
        }).then(function (response) {
          console.log(response)
        }).catch(function (error) {
          console.log(error)
        })
      }
      axios.all([getc10(), getc15()])
        .then(axios.spread(function (c10, c15) {
          // 两个请求现在都执行完成
          console.log('同时请求完成', c10, c15)
        }))
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
</style>
