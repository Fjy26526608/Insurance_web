<template>
  <div>
    <Card :padding="0" shadow class="text-center">
      <button :class="{active: changeType === 1}" @click="changeTopTab(1)" class="top_tab_button">企业</button>
      <button :class="{active: changeType === 2}" @click="changeTopTab(2)" class="top_tab_button">个人</button>
    </Card>
    <div class="parentPosition">
      <Spin v-show="hasShowSpin" size="large" :fix="true"></Spin>
      <Row :gutter="20" class="mt20">
        <i-col span="12">
          <Card shadow>
            <div class="table-card-title">
              <h3 class="pull-left">近期保险到期（10天内）</h3>
              <router-link class="pull-right" to="/foo">查看更多</router-link>
            </div>
            <table class="table-card-box mt20" cellpadding="0" cellspacing="0" >
              <thead>
                <td>编号</td>
                <td>单位</td>
                <td>日期</td>
                <td>到期</td>
                <td>金额</td>
              </thead>
              <tbody>
                <tr>
                  <td>2071654</td>
                  <td>山东如意集团</td>
                  <td>2018.12.20</td>
                  <td>2018.12.20</td>
                  <td>1000.00</td>
                </tr>
                <tr>
                  <td>2071654</td>
                  <td>山东如意集团</td>
                  <td>2018.12.20</td>
                  <td>2018.12.20</td>
                  <td>1000.00</td>
                </tr>
                <tr>
                  <td>2071654</td>
                  <td>山东如意集团</td>
                  <td>2018.12.20</td>
                  <td>2018.12.20</td>
                  <td>1000.00</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </i-col>
        <i-col span="12">
          <Card shadow>
            <div class="table-card-title">
              <h3 class="pull-left">近期保险到期（10天内）</h3>
              <router-link class="pull-right" to="/foo">查看更多</router-link>
            </div>
            <table class="table-card-box mt20" cellpadding="0" cellspacing="0" >
              <thead>
                <td>编号</td>
                <td>单位</td>
                <td>日期</td>
                <td>到期</td>
                <td>金额</td>
              </thead>
              <tbody>
                <tr>
                  <td>2071654</td>
                  <td>山东如意集团</td>
                  <td>2018.12.20</td>
                  <td>2018.12.20</td>
                  <td>1000.00</td>
                </tr>
                <tr>
                  <td>2071654</td>
                  <td>山东如意集团</td>
                  <td>2018.12.20</td>
                  <td>2018.12.20</td>
                  <td>1000.00</td>
                </tr>
                <tr>
                  <td>2071654</td>
                  <td>山东如意集团</td>
                  <td>2018.12.20</td>
                  <td>2018.12.20</td>
                  <td>1000.00</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </i-col>
        <i-col span="12" class="mt20">
          <Card shadow>
            <div class="table-card-title">
              <h3 class="pull-left">近期保险到期（10天内）</h3>
              <router-link class="pull-right" to="/foo">查看更多</router-link>
            </div>
            <table class="table-card-box mt20" cellpadding="0" cellspacing="0" >
              <thead>
                <td>编号</td>
                <td>单位</td>
                <td>日期</td>
                <td>到期</td>
                <td>金额</td>
              </thead>
              <tbody>
                <tr>
                  <td>2071654</td>
                  <td>山东如意集团</td>
                  <td>2018.12.20</td>
                  <td>2018.12.20</td>
                  <td>1000.00</td>
                </tr>
                <tr>
                  <td>2071654</td>
                  <td>山东如意集团</td>
                  <td>2018.12.20</td>
                  <td>2018.12.20</td>
                  <td>1000.00</td>
                </tr>
                <tr>
                  <td>2071654</td>
                  <td>山东如意集团</td>
                  <td>2018.12.20</td>
                  <td>2018.12.20</td>
                  <td>1000.00</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </i-col>
        <i-col span="12" class="mt20">
          <Card shadow>
            <div class="table-card-title">
              <h3 class="pull-left">近期保险到期（10天内）</h3>
              <router-link class="pull-right" to="/foo">查看更多</router-link>
            </div>
            <table class="table-card-box mt20" cellpadding="0" cellspacing="0" >
              <thead>
                <td>编号</td>
                <td>单位</td>
                <td>日期</td>
                <td>到期</td>
                <td>金额</td>
              </thead>
              <tbody>
                <tr>
                  <td>2071654</td>
                  <td>山东如意集团</td>
                  <td>2018.12.20</td>
                  <td>2018.12.20</td>
                  <td>1000.00</td>
                </tr>
                <tr>
                  <td>2071654</td>
                  <td>山东如意集团</td>
                  <td>2018.12.20</td>
                  <td>2018.12.20</td>
                  <td>1000.00</td>
                </tr>
                <tr>
                  <td>2071654</td>
                  <td>山东如意集团</td>
                  <td>2018.12.20</td>
                  <td>2018.12.20</td>
                  <td>1000.00</td>
                </tr>
              </tbody>
            </table>
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
      hasShowSpin: false
    }
  },
  methods: {
    changeTopTab (type) { // 切换类型
      this.changeType = type
      this.hasShowSpin = true
      setTimeout(() => {
        this.hasShowSpin = false
      }, 1000)
    }
  }
}
</script>

<style lang="less">
.count-style{
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

.table-card-title  {
  height: 20px;
}

.table-card-title h3  {
  color: rgb(45, 140, 240);
}

.table-card-title a {
  margin-top: 3px;
}

.table-card-box {
  width: 100%;
  border-collapse:collapse;
}

.table-card-box thead td {
  color: #FFF;
  background: rgba(45, 140, 240, 1);
}

.table-card-box td {
  width: 20%;
  text-align: center;
  height: 36px;
  border: 1px solid #ececec;
}

.parentPosition {
  position: relative
}
</style>
