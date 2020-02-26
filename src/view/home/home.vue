<template>
  <div>
    <Card :padding="0" shadow class="text-center">
      <button
        :class="{ active: changeType === 1 }"
        @click="changeTopTab(1)"
        class="top_tab_button"
      >企业</button>
      <button
        :class="{ active: changeType === 2 }"
        @click="changeTopTab(2)"
        class="top_tab_button"
      >个人</button>
    </Card>
    <div class="parentPosition" v-if="show">
      <Spin v-show="hasShowSpin" size="large" :fix="true"></Spin>
      <Row :gutter="20" class="mt20">
        <i-col span="12">
          <Card shadow>
            <div class="table-card-title">
              <h3 class="pull-left">近期保险到期（10天以内）</h3>
              <router-link class="pull-right" to="/insurance/enterprise/allDate10">查看更多</router-link>
            </div>
            <Table
              size="large"
              border
              stripe
              :columns="ctableTitle"
              :data="ctableDet10"
              max-height="720"
              style="width:100%;font-size: 20px; "
              @on-row-dblclick="cdet"
            ></Table>
            <!-- <table class="table-card-box mt20" cellpadding="0" cellspacing="0" ></table>-->
          </Card>
        </i-col>
        <i-col span="12">
          <Card shadow>
            <div class="table-card-title">
              <h3 class="pull-left">近期保险到期（10~15天）</h3>
              <router-link class="pull-right" to="/insurance/enterprise/allDate15">查看更多</router-link>
            </div>
            <Table
              size="large"
              border
              stripe
              :columns="ctableTitle"
              :data="ctableDet15"
              max-height="720"
              style="width:100%;font-size: 20px; "
              @on-row-dblclick="cdet"
            ></Table>
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
              <router-link class="pull-right" to="/insurance/personal/allDate10">查看更多</router-link>
            </div>
            <Table
              size="large"
              border
              stripe
              :columns="ptableTitle"
              :data="ptableDet10"
              max-height="720"
              style="width:100%;font-size: 20px; "
              @on-row-dblclick="pdet"
            ></Table>
            <!-- <table class="table-card-box mt20" cellpadding="0" cellspacing="0" ></table>-->
          </Card>
        </i-col>
        <i-col span="12">
          <Card shadow>
            <div class="table-card-title">
              <h3 class="pull-left">近期保险到期（10~15天）</h3>
              <router-link class="pull-right" to="/insurance/personal/allDate15">查看更多</router-link>
            </div>
            <Table
              size="large"
              border
              stripe
              :columns="ptableTitle"
              :data="ptableDet15"
              max-height="720"
              style="width:100%;font-size: 20px; "
              @on-row-dblclick="pdet"
            ></Table>
            <!-- <table class="table-card-box mt20" cellpadding="0" cellspacing="0"></table> -->
          </Card>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      changeType: 1,
      hasShowSpin: false,
      ctableTitle: [
        {
          title: '编号',
          key: 'id',
          align: 'center'
        },
        {
          title: '名称',
          key: 'name',
          align: 'center',
          tooltip: true
        },
        {
          title: '日期',
          key: 'date',
          align: 'center'
        },
        {
          title: '到期',
          key: 'stopDate',
          align: 'center'
        },
        {
          title: '金额',
          key: 'money',
          align: 'center'
        }
      ],
      ptableTitle: [
        {
          title: '编号',
          key: 'id',
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name',
          align: 'center',
          tooltip: true
        },
        {
          title: '日期',
          key: 'date',
          align: 'center'
        },
        {
          title: '到期',
          key: 'stopDate',
          align: 'center'
        },
        {
          title: '金额',
          key: 'money',
          align: 'center'
        }
      ],
      ctableDet10: [
        {
          id: 12345,
          name: '山东新华电脑学院东校区',
          date: '2018-8-8',
          stopDate: '2019-8-8',
          money: 1999
        }
      ],
      ctableDet15: [
        {
          id: 12345,
          name: '山东新华电脑学院西校区',
          date: '2018-8-8',
          stopDate: '2019-8-8',
          money: 1999
        }
      ],
      ptableDet10: [
        {
          id: 12345,
          name: '路人甲',
          date: '2018-8-8',
          stopDate: '2019-8-8',
          money: 1999
        }
      ],
      ptableDet15: [
        {
          id: 12345,
          name: '炮灰乙',
          date: '2018-8-8',
          stopDate: '2019-8-8',
          money: 1999
        }
      ],
      show: true
    }
  },
  beforeCreate: function (e) {
    console.log('before create', e)
  },
  methods: {
    changeTopTab (type) {
      // 切换类型
      this.changeType = type
      if (type === 1) {
        this.show = true
      } else {
        this.show = false
      }
      this.hasShowSpin = true
      setTimeout(() => {
        this.hasShowSpin = false
      }, 1000)
    },
    cdet (e, index) {
      console.log('我的下标是', index, e)
      this.$router.push({ path: '/insurance/enterprise/allDate10' })
    },
    pdet (e, index) {
      console.log('我的下标是', index, e)
      this.$router.push({ path: '/insurance/personal/allDate15' })
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
