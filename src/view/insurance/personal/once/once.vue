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
        <Button type="primary" @click="showAddModal = true" class="mr15">新增</Button>
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
      <Table size="large" border stripe highlight-row :columns="columns" :data="tableLisr" @on-row-dblclick="pdet"></Table>
    </div>
    <div class="text-right pageList">
      <Page :total="total" @on-change="changePage" :current.sync="pageNo" :page-size="pageSize" show-total show-elevator />
    </div>
    <Modal v-model="showAddModal" title="添加保险合同" @on-ok="ok" @on-cancel="cancel" :closable="false" :mask-closable="false" width="60%" ok-text='添加'>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="合同编号" prop="number">
          <Input v-model="formValidate.number" placeholder="输入合同编号" :disabled="!isChange"></Input>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="输入被保人姓名" :disabled="!isChange"></Input>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input v-model="formValidate.phone" placeholder="输入被保人电话" :disabled="!isChange"></Input>
        </FormItem>
        <!-- <FormItem label="地址" prop="address">
                <Input v-model="formValidate.address" placeholder="输入被保人地址" :disabled="!isChange"></Input>
            </FormItem> -->
        <FormItem label="保险类型" prop="insuranceType">
          <Select v-model="formValidate.insuranceType" placeholder="选择保险类型">
            <Option v-for="item in insuranceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="合同日期">
          <!-- <Row>
                        <Col span="3"> -->
          <FormItem prop="date">
            <DatePicker type="date" placeholder="选择日期" v-model="formValidate.date"></DatePicker>
          </FormItem>
          <!-- </Col>
                        <Col span="2" style="text-align: center">结束日期</Col>
                    <Col span="3">
                    <FormItem prop="stopDate">
                        <DatePicker type="date" placeholder="选择日期" v-model="formValidate.stopDate"></DatePicker>
                    </FormItem>
                    </Col>
                    </Row> -->
        </FormItem>
        <FormItem label="成本单价" prop="unitPrice">
          <Input v-model="formValidate.unitPrice" placeholder="输入成本单价（月/元）" :disabled="!isChange"></Input>
        </FormItem>
        <FormItem label="购买时长" prop="duration">
          <Input v-model="formValidate.duration" placeholder="输入购买时长（月）" :disabled="!isChange"></Input>
        </FormItem>
        <FormItem label="实际支付" prop="payment">
          <Input v-model="formValidate.payment" placeholder="输入实际支付金额（元）" :disabled="!isChange"></Input>
        </FormItem>
        <!-- <FormItem label="邮箱" prop="mail">
                <Input v-model="formValidate.mail" placeholder="输入电子邮箱"></Input>
                </FormItem>-->
        <FormItem label="备注" prop="desc">
          <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入备注..." :disabled="!isChange"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'personalOnce',
  data() {
    return {
      total: 100,
      pageSize: 10,
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
          align: 'center',
          tooltip: true,
          title: '合同编号',
          key: 'index'
        },
        {
          align: 'center',
          tooltip: true,
          title: '名称',
          key: 'name'
        },
        {
          align: 'center',
          tooltip: true,
          title: '保险类型',
          key: 'type'
        },
        {
          align: 'center',
          tooltip: true,
          title: '购买日期',
          key: 'createTime'
        },
        {
          align: 'center',
          tooltip: true,
          title: '金额',
          key: 'amount'
        },
        {
          align: 'center',
          tooltip: true,
          title: '到期日期',
          key: 'endTime'
        },
        {
          align: 'center',
          tooltip: true,
          title: '手续费',
          key: 'poundage'
        },
        {
          align: 'center',
          tooltip: true,
          title: '实际支付',
          key: 'stno'
        },
        {
          align: 'center',
          tooltip: true,
          title: '已使用',
          key: 'on'
        },
        {
          align: 'center',
          tooltip: true,
          title: '剩余',
          key: 'remaining'
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
      ],
      showAddModal: false,
      isChange: true,
      insuranceList: [
        {
          value: '1',
          label: '企财险'
        },
        {
          value: '2',
          label: '工程险'
        },
        {
          value: '3',
          label: '车险'
        },
        {
          value: '4',
          label: '医疗险'
        },
        {
          value: '5',
          label: '子女教育险'
        },
        {
          value: '6',
          label: '养老险'
        }
      ],
      formValidate: {
        name: '', // 姓名
        number: '', // 编号
        address: '', // 地址
        manager: '', // 联系人
        unitPrice: '', // 单价
        duration: '', // 购买时长
        payment: '', // 实际支付
        phone: '', // 电话
        mail: '', // 邮箱
        insuranceType: '', // 保险类型
        gender: '', // 性别
        date: '', // 日期
        time: '',
        desc: '' // 备注
      },
      ruleValidate: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        // address: [
        //     { required: true, message: "地址不能为空", trigger: "blur" }
        // ],
        manager: [
          {
            required: true,
            message: '联系人不能为空',
            trigger: 'blur'
          }
        ],
        number: [
          {
            required: true,
            message: '合同编号不能为空',
            trigger: 'blur'
          }
        ],
        unitPrice: [
          {
            required: true,
            message: '成本单价不能为空',
            trigger: 'blur'
          }
        ],
        duration: [
          {
            required: true,
            message: '购买时长不能为空',
            trigger: 'blur'
          }
        ],
        payment: [
          {
            required: true,
            message: '实际支付不能为空',
            trigger: 'blur'
          }
        ],
        phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
        insuranceType: [
          {
            required: true,
            message: '请选择保险类型',
            trigger: 'change'
          }
        ],
        // mail: [
        //     { required: true, message: '邮箱不能为空', trigger: 'blur' },
        //     { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        // ],
        // gender: [
        //     { required: true, message: '请选择性别', trigger: 'change' }
        // ],
        date: [
          {
            required: true,
            type: 'date',
            message: '请选择日期',
            trigger: 'change'
          }
        ]
        // desc: [
        //   {
        //     required: true,
        //     message: "请输入备注",
        //     trigger: "blur"
        //   },
        //   {
        //     type: "string",
        //     min: 20,
        //     message: "最少10个字",
        //     trigger: "blur"
        //   }
        // ]
      }
    }
  },
  methods: {
    changePage(page) {
      // alert(page)
    },
    pdet(e, index) {
      console.log('我的下标是', index, e)
      this.$router.push({
        path: '/insurance/personal/pdet',
        query: { id: e.id }
      })
    },
    cancel() {
      this.$Message.success('点击取消!')
    },
    ok() {
      this.$Message.success('点击确定!')
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
