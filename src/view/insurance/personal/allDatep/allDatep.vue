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
      <!-- <i-col span="12" class="mt20">
        <Button type="primary" @click="showAddModal = true" class="mr15">新增</Button> -->
      <!-- <Button type="warning" class="mr15">删除</Button>
        <Button>导出</Button> -->
      <!-- </i-col> -->
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
      <Table :loading="loading" highlight-row size="large" border  :columns="columns" :data="tableLisr" @on-row-dblclick="pdet"><template slot-scope="{ row }" slot="id">
          <strong>{{ row.id }}</strong>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button type="error" @click="remove(row.id)" :disabled="!isAdmin">删除</Button>
        </template></Table>
    </div>
    <div class="text-right pageList">
      <Page :total="total" @on-change="changePage" :current.sync="pageNo" :page-size="pageSize" show-total show-elevator />
    </div>
    <Modal v-model="showAddModal" title="添加保险合同" @on-ok="ok" @on-cancel="cancel" :closable="false" :mask-closable="false" width="60%" ok-text='添加'>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="合同编号" prop="number">
          <Input v-model="formValidate.number" placeholder="输入合同编号"></Input>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="输入被保人姓名"></Input>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input v-model="formValidate.phone" placeholder="输入被保人电话"></Input>
        </FormItem>
        <!-- <FormItem label="地址" prop="address">
                <Input v-model="formValidate.address" placeholder="输入被保人地址" ></Input>
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
          <Input v-model="formValidate.unitPrice" placeholder="输入成本单价（月/元）"></Input>
        </FormItem>
        <FormItem label="购买时长" prop="duration">
          <Input v-model="formValidate.duration" placeholder="输入购买时长（月）"></Input>
        </FormItem>
        <FormItem label="实际支付" prop="payment">
          <Input v-model="formValidate.payment" placeholder="输入实际支付金额（元）"></Input>
        </FormItem>
        <FormItem label="备注" prop="desc">
          <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入备注..."></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="deleteInsuModal" title='警告！' @on-ok="deleteOk" @on-cancel="deleteCancel">
      <p>删除后不可恢复，确认删除吗？</p>
    </Modal>
  </div>
</template>

<script>
  import axios from '@/libs/api.request'
  import { getInsuranceTypes, saveOrModifyInsuranceInfo, deleteInsuranceInfo } from '@/api/insurance'
  export default {
    name: 'allDate',
    data() {
      return {
        deleteInsuModal: false,
        removeId: '',
        showAddModal: false,
        total: 0,
        pageSize: 15,
        pageNo: 1,
        columns: [
          {
            tooltip: true,
            align: 'center',
            title: '编号',
            key: 'id'
          },
          {
            tooltip: true,
            align: 'center',
            title: '名称',
            key: 'insured'
          },
          // {
          //   tooltip: true,
          //   align: 'center',
          //   title: '保险类型',
          //   key: 'type'
          // },
          // {
          //   tooltip: true,
          //   align: 'center',
          //   title: '购买日期',
          //   key: 'createTime'
          // },
          // {
          //   tooltip: true,
          //   align: 'center',
          //   title: '金额',
          //   key: 'amount'
          // },
          {
            tooltip: true,
            align: 'center',
            title: '到期日期',
            key: 'reminddate'
          },
          // {
          //   tooltip: true,
          //   align: 'center',
          //   title: '管理费',
          //   key: 'poundage'
          // },
          // {
          //   tooltip: true,
          //   align: 'center',
          //   title: '实际支付',
          //   key: 'stno'
          // },
          // {
          //   tooltip: true,
          //   align: 'center',
          //   title: '已使用',
          //   key: 'on'
          // },
          // {
          //   tooltip: true,
          //   align: 'center',
          //   title: '剩余',
          //   key: 'remaining'
          // },
          {
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ],
        insuranceList: [
        ],
        tableLisr1: [
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
        },
        tableLisr: [],
        loading: true,
        type: 0
      }
    },
    computed: {
      isAdmin() {
        return this.$store.state.user.access.indexOf('superadmin') >= 0
      }
    },
    created() {
      this.type = this.$route.query.type
      console.log('接收的参数', this.type)
      this.loading = false
      this.fetchPersonalInfo()
    },
    methods: {
      remove(id) {
        this.deleteInsuModal = true
        this.removeId = id
      },
      deleteCancel() { },
      deleteOk() {
        deleteInsuranceInfo(this.removeId).then((res) => {
          if (res.data.state === 'true') {
            this.$Message.success('删除成功')
            this.fetchPersonalInfo()
          } else {
            this.$Message.error('删除操作失败')
          }
        }).catch((err) => {
          console.error(err)
          this.$Message.error('请求服务器异常')
        })
      },
      fetchPersonalInfo() {
        this.loading = true
        this.tableLisr = []
        let that = this
        if (this.type === '10') {
          console.log('*********************')
          axios.request({
            method: 'post',
            url: '/maturitylist10',
            data: {
              page: this.pageNo,
              pagesize: this.pageSize,
              iscompany: false
            }
          }).then(function (res) {
            console.log('10返回值', res)
            for (let i = 0; i < res.data.data.length; i++) {
              that.tableLisr.push(res.data.data[i])
              that.tableLisr[i].reminddate = res.data.data[i].reminddate
            }
            that.total = res.data.count
          }).catch(function (error) {
            console.log(error)
          })
        } else if (this.type === '15') {
          axios.request({
            method: 'post',
            url: '/maturitylist15',
            data: {
              page: this.pageNo,
              pagesize: this.pageSize,
              iscompany: false
            }
          }).then(function (res) {
            console.log('15返回值', res)
            for (let i = 0; i < res.data.data.length; i++) {
              that.tableLisr.push(res.data.data[i])
              that.tableLisr[i].reminddate = res.data.data[i].reminddate
            }
            that.total = res.data.count
          }).catch(function (error) {
            console.log(error)
          })
        }
        this.loading = false
      },
      changePage(page) {
        this.pageNo = page
        this.fetchPersonalInfo()
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

  .demo-carousel {
    min-height: 600px;
  }

  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>