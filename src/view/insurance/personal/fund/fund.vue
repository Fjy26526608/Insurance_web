<template>
  <div>
    <Row :gutter="20">
      <!-- <i-col span="5">
        <Select class="typeSelList" v-model="typeObj">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col span="5">
        <DatePicker :clearable="true" class="typeSelList" type="date" placeholder="??????"></DatePicker>
      </i-col>
      <i-col span="5">
        <DatePicker :clearable="true" class="typeSelList" type="date" placeholder="??????"></DatePicker>
      </i-col>
      <i-col span="5">
        <Select placeholder="?????" class="typeSelList" v-model="statusObj">
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
        <Input clearable search enter-button class="typeSelList" v-model="queryStr" placeholder="??????????" />
      </i-col>
      <i-col span="24"></i-col> -->
      <i-col span="12" class="mt20">
        <Button type="primary" @click="showAddModal = true" class="mr15">??</Button>
        <!-- <Button type="warning" class="mr15">??</Button>
        <Button>??</Button> -->
      </i-col>
      <!-- <i-col span="12" class="text-right mt20">
        <span class="mr15">??</span>
        <Select class="typeSelList mr15" style="width: 160px; text-align: left;margin-right: 25px;" v-model="sortingObj">
          <Option v-for="item in sortingList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span class="mr15">??</span>
        <Select class="typeSelList" style="width: 160px; text-align: left; margin-right: 8px;" v-model="pageSize">
          <Option v-for="item in pageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span>?</span>
      </i-col> -->
    </Row>
    <div class="tableList">
      <Table size="large" border  highlight-row :columns="columns" :data="tableLisr" @on-row-dblclick="pdet"></Table>
    </div>
    <div class="text-right pageList">
      <Page :total="total" @on-change="changePage" :current.sync="pageNo" :page-size="pageSize" show-total show-elevator />
    </div>
    <Modal v-model="showAddModal" title="??????" @on-ok="ok" @on-cancel="cancel" :closable="false" :mask-closable="false" width="60%" ok-text='??'>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="????" prop="number">
          <Input v-model="formValidate.number" placeholder="??????" :disabled="!isChange"></Input>
        </FormItem>
        <FormItem label="??" prop="name">
          <Input v-model="formValidate.name" placeholder="???????" :disabled="!isChange"></Input>
        </FormItem>
        <FormItem label="??" prop="phone">
          <Input v-model="formValidate.phone" placeholder="???????" :disabled="!isChange"></Input>
        </FormItem>
        <!-- <FormItem label="??" prop="address">
                <Input v-model="formValidate.address" placeholder="???????" :disabled="!isChange"></Input>
            </FormItem> -->
        <FormItem label="????" prop="insuranceType">
          <Select v-model="formValidate.insuranceType" placeholder="??????">
            <Option v-for="item in insuranceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="????">
          <!-- <Row>
                        <Col span="3"> -->
          <FormItem prop="date">
            <DatePicker type="date" placeholder="????" v-model="formValidate.date"></DatePicker>
          </FormItem>
          <!-- </Col>
                        <Col span="2" style="text-align: center">????</Col>
                    <Col span="3">
                    <FormItem prop="stopDate">
                        <DatePicker type="date" placeholder="????" v-model="formValidate.stopDate"></DatePicker>
                    </FormItem>
                    </Col>
                    </Row> -->
        </FormItem>
        <FormItem label="????" prop="unitPrice">
          <Input v-model="formValidate.unitPrice" placeholder="????????/??" :disabled="!isChange"></Input>
        </FormItem>
        <FormItem label="????" prop="duration">
          <Input v-model="formValidate.duration" placeholder="?????????" :disabled="!isChange"></Input>
        </FormItem>
        <FormItem label="????" prop="payment">
          <Input v-model="formValidate.payment" placeholder="???????????" :disabled="!isChange"></Input>
        </FormItem>
        <!-- <FormItem label="??" prop="mail">
                <Input v-model="formValidate.mail" placeholder="??????"></Input>
                </FormItem>-->
        <FormItem label="??" prop="desc">
          <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="????..." :disabled="!isChange"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'personalFund',
  data() {
    return {
      total: 0,
      pageSize: 15,
      pageNo: 1,
      typeList: [
        {
          label: '????',
          value: 1
        },
        {
          label: '????',
          value: 2
        }
      ],
      typeObj: 1,
      statusList: [
        {
          label: '??',
          value: 0
        },
        {
          label: '??',
          value: 1
        },
        {
          label: '??',
          value: 2
        }
      ],
      statusObj: null,
      queryList: [
        {
          label: '????',
          value: 1
        },
        {
          label: '????',
          value: 2
        }
      ],
      queryObj: 1,
      queryStr: '',
      sortingList: [
        {
          label: '????',
          value: 1
        },
        {
          label: '????',
          value: 2
        },
        {
          label: '????',
          value: 3
        },
        {
          label: '????',
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
          title: '????',
          key: 'index'
        },
        {
          align: 'center',
          tooltip: true,
          title: '??',
          key: 'name'
        },
        {
          align: 'center',
          tooltip: true,
          title: '????',
          key: 'type'
        },
        {
          align: 'center',
          tooltip: true,
          title: '????',
          key: 'createTime'
        },
        {
          align: 'center',
          tooltip: true,
          title: '??',
          key: 'amount'
        },
        {
          align: 'center',
          tooltip: true,
          title: '????',
          key: 'endTime'
        },
        {
          align: 'center',
          tooltip: true,
          title: '???',
          key: 'poundage'
        },
        {
          align: 'center',
          tooltip: true,
          title: '????',
          key: 'stno'
        },
        {
          align: 'center',
          tooltip: true,
          title: '???',
          key: 'on'
        },
        {
          align: 'center',
          tooltip: true,
          title: '??',
          key: 'remaining'
        }
      ],
      tableLisr: [
        {
          index: '2051654',
          name: '??????',
          type: '???????',
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
          name: '??????',
          type: '???????',
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
          name: '??????',
          type: '???????',
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
          name: '??????',
          type: '???????',
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
          name: '??????',
          type: '???????',
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
          name: '??????',
          type: '???????',
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
          label: '???'
        },
        {
          value: '2',
          label: '???'
        },
        {
          value: '3',
          label: '??'
        },
        {
          value: '4',
          label: '???'
        },
        {
          value: '5',
          label: '?????'
        },
        {
          value: '6',
          label: '???'
        }
      ],
      formValidate: {
        name: '', // ??
        number: '', // ??
        address: '', // ??
        manager: '', // ???
        unitPrice: '', // ??
        duration: '', // ????
        payment: '', // ????
        phone: '', // ??
        mail: '', // ??
        insuranceType: '', // ????
        gender: '', // ??
        date: '', // ??
        time: '',
        desc: '' // ??
      },
      ruleValidate: {
        name: [{ required: true, message: '??????', trigger: 'blur' }],
        // address: [
        //     { required: true, message: "??????", trigger: "blur" }
        // ],
        manager: [
          {
            required: true,
            message: '???????',
            trigger: 'blur'
          }
        ],
        number: [
          {
            required: true,
            message: '????????',
            trigger: 'blur'
          }
        ],
        unitPrice: [
          {
            required: true,
            message: '????????',
            trigger: 'blur'
          }
        ],
        duration: [
          {
            required: true,
            message: '????????',
            trigger: 'blur'
          }
        ],
        payment: [
          {
            required: true,
            message: '????????',
            trigger: 'blur'
          }
        ],
        phone: [{ required: true, message: '??????', trigger: 'blur' }],
        insuranceType: [
          {
            required: true,
            message: '???????',
            trigger: 'change'
          }
        ],
        // mail: [
        //     { required: true, message: '??????', trigger: 'blur' },
        //     { type: 'email', message: '???????', trigger: 'blur' }
        // ],
        // gender: [
        //     { required: true, message: '?????', trigger: 'change' }
        // ],
        date: [
          {
            required: true,
            type: 'date',
            message: '?????',
            trigger: 'change'
          }
        ]
        // desc: [
        //   {
        //     required: true,
        //     message: "?????",
        //     trigger: "blur"
        //   },
        //   {
        //     type: "string",
        //     min: 20,
        //     message: "??10??",
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
      console.log('?????', index, e)
      this.$router.push({
        path: '/insurance/personal/pdet',
        query: { id: e.id }
      })
    },
    cancel() {
      this.$Message.success('????!')
    },
    ok() {
      this.$Message.success('????!')
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
