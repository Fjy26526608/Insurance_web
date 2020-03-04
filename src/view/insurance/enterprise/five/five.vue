<template>
  <div>
    <Row :gutter="20">
      <!-- <i-col span="5">
        <Select class="typeSelList" v-model="typeObj">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col span="5">
        <DatePicker :clearable="true" class="typeSelList" type="date" placeholder="选择开始时间"></DatePicker>
      </i-col>
      <i-col span="5">
        <DatePicker :clearable="true" class="typeSelList" type="date" placeholder="选择结束时间"></DatePicker>
      </i-col>
      <i-col span="5">
        <Select placeholder="请选择状态" class="typeSelList" v-model="statusObj">
          <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col span="24"></i-col>
      <i-col span="4" class="mt20">
        <Select class="typeSelList" v-model="queryObj">
          <Option v-for="item in queryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col span="12" class="mt20">
        <Input clearable search enter-button class="typeSelList" v-model="queryStr" placeholder="输入内容按回车键查询" />
      </i-col>
      <i-col span="24"></i-col> -->
      <i-col span="12" class="mt20">
        <Button type="primary" class="mr15">新增</Button>
        <!-- <Button type="warning" class="mr15">删除</Button>
        <Button>导出</Button> -->
      </i-col>
      <!-- <i-col span="12" class="text-right mt20">
        <span class="mr15">排序</span>
        <Select class="typeSelList mr15" style="width: 160px; text-align: left;margin-right: 25px;" v-model="sortingObj">
          <Option v-for="item in sortingList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span class="mr15">显示</span>
        <Select class="typeSelList" style="width: 160px; text-align: left; margin-right: 8px;" v-model="pageSize">
          <Option v-for="item in pageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span>条</span>
      </i-col> -->
    </Row>
    <div class="tableList">
      <Table border ref="selection" :columns="columns" :data="tableLisr"></Table>
    </div>
    <div class="text-right pageList">
      <Page :total="total" @on-change="changePage" :current.sync="pageNo" :page-size="pageSize" show-total show-elevator />
    </div>
  </div>
</template>

<script>
export default {
  name: 'enterpriseFive',
  data () {
    return {
      total: 0,
      pageSize: 15,
      pageNo: 1,
      typeList: [
        {
          label: '创建时间',
          value: 1
        },
        {
          label: '结束时间',
          value: 2
        }
      ],
      typeObj: 1,
      statusList: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '启动',
          value: 1
        },
        {
          label: '暂停',
          value: 2
        }
      ],
      statusObj: null,
      queryList: [
        {
          label: '按名称：',
          value: 1
        },
        {
          label: '按编号：',
          value: 2
        }
      ],
      queryObj: 1,
      queryStr: '',
      sortingList: [
        {
          label: '序号正序',
          value: 1
        },
        {
          label: '序号倒叙',
          value: 2
        },
        {
          label: '日期正叙',
          value: 3
        },
        {
          label: '日期倒叙',
          value: 4
        }
      ],
      sortingObj: 1,
      pageList: [
        {
          label: '10',
          value: 10
        },
        {
          label: '20',
          value: 20
        },
        {
          label: '50',
          value: 50
        },
        {
          label: '100',
          value: 100
        }
      ],
      columns: [
        {
          title: '合同编号',
          key: 'index',
          align: 'center',
          tooltip: true
        },
        {
          title: '名称',
          key: 'name',
          align: 'center',
          tooltip: true
        },
        {
          title: '保险类型',
          key: 'type',
          align: 'center',
          tooltip: true
        },
        {
          title: '购买日期',
          key: 'createTime',
          align: 'center',
          tooltip: true
        },
        {
          title: '金额',
          key: 'amount',
          align: 'center',
          tooltip: true
        },
        {
          title: '到期日期',
          key: 'endTime',
          align: 'center',
          tooltip: true
        },
        {
          title: '手续费',
          key: 'poundage',
          align: 'center',
          tooltip: true
        },
        {
          title: '实际支付',
          key: 'stno',
          align: 'center',
          tooltip: true
        },
        {
          title: '已使用',
          key: 'on',
          align: 'center',
          tooltip: true
        },
        {
          title: '剩余',
          key: 'remaining',
          align: 'center',
          tooltip: true
        }
      ],
      tableLisr: [
        {
          index: '2051654',
          name: '山东如意集团',
          type: '五险，工伤保险',
          createTime: '2016.12.20',
          amount: '1000.00',
          endTime: '2019.12.20',
          poundage: '1000.00',
          stno: '2000.00',
          on: '1000.00',
          remaining: '0.00'
        },
        {
          index: '2051654',
          name: '山东如意集团',
          type: '五险，工伤保险',
          createTime: '2016.12.20',
          amount: '1000.00',
          endTime: '2019.12.20',
          poundage: '1000.00',
          stno: '2000.00',
          on: '1000.00',
          remaining: '0.00'
        },
        {
          index: '2051654',
          name: '山东如意集团',
          type: '五险，工伤保险',
          createTime: '2016.12.20',
          amount: '1000.00',
          endTime: '2019.12.20',
          poundage: '1000.00',
          stno: '2000.00',
          on: '1000.00',
          remaining: '0.00'
        },
        {
          index: '2051654',
          name: '山东如意集团',
          type: '五险，工伤保险',
          createTime: '2016.12.20',
          amount: '1000.00',
          endTime: '2019.12.20',
          poundage: '1000.00',
          stno: '2000.00',
          on: '1000.00',
          remaining: '0.00'
        },
        {
          index: '2051654',
          name: '山东如意集团',
          type: '五险，工伤保险',
          createTime: '2016.12.20',
          amount: '1000.00',
          endTime: '2019.12.20',
          poundage: '1000.00',
          stno: '2000.00',
          on: '1000.00',
          remaining: '0.00'
        },
        {
          index: '2051654',
          name: '山东如意集团',
          type: '五险，工伤保险',
          createTime: '2016.12.20',
          amount: '1000.00',
          endTime: '2019.12.20',
          poundage: '1000.00',
          stno: '2000.00',
          on: '1000.00',
          remaining: '0.00'
        }
      ]
    }
  },
  methods: {
    changePage (page) {
      alert(page)
    }
  }
}
</script>

<style lang="less" scoped>
  .typeSelList {
    width: 100%;
  }

  .tableList {
    margin-top: 30px;
    position: relative;
  }

  .pageList {
    margin-top: 30px;
  }
</style>
