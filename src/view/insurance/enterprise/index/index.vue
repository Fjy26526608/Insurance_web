<style>
  .ivu-table .demo-table-y-row td {
    /* color: rgba(255, 153, 0, 1); */
    background-color: rgb(252, 235, 137);
  }

  .ivu-table .demo-table-r-row td {
    /* color: rgb(255, 0, 0, 1); */
    background-color: rgb(252, 137, 137);
  }
</style>

<template>
  <div>
    <Row :gutter="20">
      <!-- <i-col span="5">
        <Input v-model="typeName">
        <span slot="prepend">名称</span>
        </Input>
      </i-col>
      <i-col span="5">
        <DatePicker :clearable="true" class="typeSelList" type="date" v-model="typeStartDate" placeholder="选择开始时间"></DatePicker>
      </i-col>
      <i-col span="5">
        <DatePicker :clearable="true" class="typeSelList" type="date" v-model="typeEndDate" placeholder="选择结束时间"></DatePicker>
      </i-col>
      <i-col span="9"></i-col> -->
      <!-- <i-col span="5">
        <Select class="typeSelList" v-model="typeObj">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col> -->
      <i-col span="4">
        <DatePicker :clearable="true" class="typeSelList" type="date" @on-change='doStart' v-model='startData' placeholder="选择开始时间"></DatePicker>
      </i-col>
      <i-col span="4">
        <DatePicker :clearable="true" class="typeSelList" type="date" @on-change='doEnd' v-model='endData' placeholder="选择结束时间"></DatePicker>
      </i-col>
      <!-- <i-col span="4">
        <Select placeholder="请选择状态" class="typeSelList" v-model="statusObj" @on-change='selectStatus'>
          <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col> -->
      <!-- <i-col span="24"></i-col> -->
      <!-- <i-col span="4" class="mt20">
        <Select class="typeSelList" v-model="queryObj">
          <Option v-for="item in queryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col> -->
      <i-col span="11">
        <Input clearable search enter-button="搜索" @on-search='doSearch' class="typeSelList" v-model="queryStr" placeholder="输入内容按回车键查询">
        <!-- <Select v-model="select1" slot="prepend" style="width: 80px">
          <Option value="1">按名称：</Option>
          <Option value="2">按编号：</Option>
        </Select> -->
        </Input>
      </i-col>
      <i-col span="24"></i-col>
      <i-col span="12" class="mt20">
        <Button type="primary" size="large" @click="showAddModal = true" class="mr15">新增企业</Button>
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
      <Table size="large" :loading="loading" :row-class-name="rowClassName" border  :columns="columns" :data="tableLisr" @on-row-dblclick="cdet">
        <template slot-scope="{ row }" slot="id">
          <strong>{{ row.id }}</strong>
        </template>
        <template slot-scope="{ row }" slot="action">
          <!-- <Button type="warning" v-if="isAdmin || iskj" @click="shen(row.id)" style="margin:0 5px;">审核</Button> -->
          <Button type="error" v-if="isAdmin" @click="remove(row.id)" style="margin:0 5px;">删除</Button>
        </template>
      </Table>
    </div>
    <div class="text-right pageList">
      <Page :total="total" @on-change="changePage" :current.sync="pageNo" :page-size="pageSize" show-total show-elevator />
    </div>
    <Modal v-model="showAddModal" title="添加企业信息" @on-ok="ok" @on-cancel="cancel" :closable="false" :mask-closable="false" width="60%" ok-text='添加' :styles="{top: '20px'}" :loading="modalLoading">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="名称" prop="name">
          <Input v-model="formValidate.name" placeholder="输入公司名称"></Input>
        </FormItem>
        <!-- <FormItem label="规模" prop="psize">
          <Input v-model="formValidate.psize" placeholder="输入公司规模"></Input>
        </FormItem> -->
        <FormItem label="地址" prop="address">
          <Input v-model="formValidate.address" placeholder="输入公司地址"></Input>
        </FormItem>
        <FormItem label="合同日期">
          <Row>
            <Col span="4">
            <FormItem prop="date">
              <DatePicker type="date" placeholder="选择日期" v-model="formValidate.stime"></DatePicker>
            </FormItem>
            </Col>
            <Col span="2" style="text-align: center">结束日期</Col>
            <Col span="4">
            <FormItem prop="stopDate">
              <DatePicker type="date" placeholder="选择日期" v-model="formValidate.etime"></DatePicker>
            </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="联系人" prop="contactperson">
          <Input v-model="formValidate.contactperson" placeholder="输入公司联系人"></Input>
        </FormItem>
        <FormItem label="电话" prop="tel">
          <Input v-model="formValidate.tel" placeholder="输入公司电话"></Input>
        </FormItem>
        <!-- <FormItem label="备注" prop="desc">
          <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入备注..."></Input>
        </FormItem> -->
      </Form>
    </Modal>
    <Modal v-model="deleteCompanyModal" title='警告！' @on-ok="deleteOk" @on-cancel="deleteCancel">
      <p>删除后不可恢复，确认删除吗？</p>
    </Modal>
    <Modal v-model="shModal" title='警告！' @on-ok="shenOk" @on-cancel="cancel">
      <p>确定通过审核吗？</p>
    </Modal>
  </div>
</template>

<script>
  import { getToken, formatDate } from '@/libs/util'
  import axios from '@/libs/api.request'
  import { addCompany, delCompany } from '@/api/company'
  export default {
    name: 'enterprise',
    props: ['typeId'],
    data() {
      return {
        deleteCompanyModal: false,
        shId: '',
        shModal: false,
        removeId: '',
        value1: 0,
        imgData: '',
        imgArr: [],
        imgSrc: '',
        visible: false,
        allowAddImg: true,
        showAddModal: false,
        modalLoading: true,
        select1: '1',
        startData: '',
        endData: '',
        total: 0, // 一共有多少行
        pageSize: 15, // 每页显示行数
        pageNo: 1, // 第几页
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
          phone: '', // 电话
          date: '', // 日期
          stopDate: '', // 结束日期
          desc: '' // 备注
        },
        ruleValidate: {
          name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
          address: [
            { required: true, message: "地址不能为空", trigger: "blur" }
          ],
          contactperson: [
            {
              required: true,
              message: '联系人不能为空',
              trigger: 'blur'
            }
          ],
          tel: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
          stime: [
            {
              required: true,
              type: 'date',
              message: '请选择日期',
              trigger: 'change'
            }
          ],
          etime: [
            {
              required: true,
              type: 'date',
              message: '请选择日期',
              trigger: 'change'
            }
          ]
        },
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
        typeName: '',
        typeStartDate: '',
        typeEndDate: '',
        typeObj: 1,
        statusList: [
          {
            label: '正常',
            value: 1
          },
          {
            label: '预到期',
            value: 2
          },
          {
            label: '已过期',
            value: 3
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
            title: '编号',
            key: 'id',
            align: 'center',
            tooltip: true,
            width: 65
          },
          {
            title: '公司名称',
            key: 'name',
            align: 'center',
            tooltip: true,
            minWidth: 240
          },
          // {
          //   title: '地址',
          //   key: 'addrss',
          //   align: 'center',
          //   tooltip: true
          //   //width:240
          // },
          // {
          //   title: '公司规模',
          //   key: 'psize',
          //   align: 'center',
          //   tooltip: true,
          //   width:95
          // },
          {
            title: '合同起始日期',
            key: 'stime',
            align: 'center',
            tooltip: true,
            minWidth: 130,
            maxWidth: 130
          },
          {
            title: '合同结束日期',
            key: 'etime',
            align: 'center',
            tooltip: true,
            minWidth: 130,
            maxWidth: 130
          },
          // {
          //   title: '负责人名字',
          //   key: 'contactperson',
          //   align: 'center',
          //   tooltip: true,
          //   width: 110
          // },
          {
            title: '总成本(元)',
            key: 'cost',
            align: 'center',
            tooltip: true,
            width: 110
          },
          {
            title: '管理费(元)',
            key: 'glf',
            align: 'center',
            tooltip: true,
            width: 120
          },
          {
            title: '实际支付(元)',
            key: 'actualpayment',
            align: 'center',
            tooltip: true,
            width: 150
          },
          {
            title: '已使用(元)',
            key: 'alreadyused',
            align: 'center',
            tooltip: true,
            minWidth: 110,
            maxWidth: 130
          },
          {
            title: '剩余(元)',
            key: 'balance',
            align: 'center',
            tooltip: true,
            maxWidth: 130,
            minWidth: 130
          },
          // {
          //   title: '备注',
          //   key: 'remark',
          //   align: 'center',
          //   tooltip: true
          // },
          {
            title: '操作',
            slot: 'action',
            align: 'center',
            minWidth: 100,
            maxWidth: 100
          }

        ],
        tableLisr: [],
        loading: true,
        a: '',
        b: ''
      }
    },
    computed: {
      isAdmin() {
        return this.$store.state.user.access.indexOf('superadmin') >= 0
      },
      iskj() {
        return this.$store.state.user.access.indexOf('admin') >= 0
      }
    },
    created() {
      console.log('完成创建')
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.fetchCompanyList()
      })
    },
    methods: {
      doSearch() {
        console.log('搜索值', this.queryStr, JSON.stringify(this.startData), JSON.stringify(this.endData))
        this.loading = true
        this.tableLisr = []
        let that = this
        if (this.startData == '') {
          this.a = ''
        } else {
          this.a = formatDate(this.startData, 'yyyy-MM-dd')
        }
        if (this.endData == '') {
          this.b = ''
        } else {
          this.b = formatDate(this.endData, 'yyyy-MM-dd')
        }
        axios.request({
          method: 'post',
          url: '/main/companylist',
          data: {
            page: this.pageNo,
            pagesize: this.pageSize,
            name: this.queryStr,
            btime: this.a,
            etime: this.b,
            instypeid: this.typeId
          }
        }).then(function (res) {
          console.log('查询返回值', res)
          for (let i = 0; i < res.data.data.length; i++) {
            that.tableLisr.push(res.data.data[i])
            that.tableLisr[i].glf = that.tableLisr[i].glf.toFixed(2)
            that.tableLisr[i].actualpayment = that.tableLisr[i].actualpayment.toFixed(2)
            that.tableLisr[i].alreadyused = that.tableLisr[i].alreadyused.toFixed(2)
            that.tableLisr[i].balance = that.tableLisr[i].balance.toFixed(2)
            that.tableLisr[i].allmoney = that.tableLisr[i].allmoney.toFixed(2)
            that.tableLisr[i].cost = that.tableLisr[i].cost.toFixed(2)
            let abc = new Date(res.data.data[i].stime)
            that.tableLisr[i].stime = formatDate(abc, 'yyyy-MM-dd')
            let cba = new Date(res.data.data[i].etime)
            that.tableLisr[i].etime = formatDate(cba, 'yyyy-MM-dd')
          }
          that.total = res.data.count
        }).catch(function (error) {
          console.log(error)
        })
        this.loading = false
      },
      doStart() {
        console.log('开始日期', this.startData)
      },
      doEnd() {
        console.log('结束日期', this.endData)
      },
      selectStatus() {
        console.log('状态选择', this.statusObj)
      },
      fetchCompanyList() {
        this.loading = true
        this.tableLisr = []
        let that = this
        axios.request({
          method: 'post',
          url: '/main/companylist',
          data: {
            page: this.pageNo,
            pagesize: this.pageSize,
            instypeid: this.typeId
          }
        }).then(function (res) {
          console.log('查询企业返回值', res)
          if (res.data.state === 'true') {
            that.total = res.data.count
            for (let i = 0; i < res.data.data.length; i++) {
              that.tableLisr.push(res.data.data[i])
              that.tableLisr[i].glf = that.tableLisr[i].glf.toFixed(2)
              that.tableLisr[i].actualpayment = that.tableLisr[i].actualpayment.toFixed(2)
              that.tableLisr[i].alreadyused = that.tableLisr[i].alreadyused.toFixed(2)
              that.tableLisr[i].balance = that.tableLisr[i].balance.toFixed(2)
              that.tableLisr[i].allmoney = that.tableLisr[i].allmoney.toFixed(2)
              that.tableLisr[i].cost = that.tableLisr[i].cost.toFixed(2)
              let abc = new Date(res.data.data[i].stime)
              that.tableLisr[i].stime = formatDate(abc, 'yyyy-MM-dd')
              let cba = new Date(res.data.data[i].etime)
              that.tableLisr[i].etime = formatDate(cba, 'yyyy-MM-dd')
            }
          } else {
            that.$Message.error(res.data.msg)
          }
        }).catch(function (error) {
          console.log(error)
        })
        this.loading = false
      },
      deleteImg: function (index) {
        this.imgArr.splice(index, 1)
        if (this.imgArr.length < 9) {
          this.allowAddImg = true
        }
      },
      handleView(index) {
        this.value1 = index
        this.visible = true
      },
      changePage(page) {
        this.pageNo = page
        this.fetchCompanyList()
      },
      cancel() {
      },
      cdet(e, index) {
        console.log('我的下标是', index, e)
        this.$router.push({ path: '/insurance/enterprise/cdet' })
      },
      changeLoading() {
        this.modalLoading = false
        this.$nextTick(() => {
          this.modalLoading = true
        })
      },
      ok() {
        this.$refs['formValidate'].validate((valid) => {
          if (!valid) {
            return this.changeLoading()
          }
          // 请求服务端添加接口
          const { name, number, address, contactperson, tel, stime, etime, desc } = this.formValidate
          const data = {
            name,
            // psize: number,
            address,
            stime: formatDate(stime, 'yyyy-MM-dd'),
            etime: formatDate(etime, 'yyyy-MM-dd'),
            contactperson: contactperson,
            tel: tel,
            // remark: desc
          }
          addCompany(data).then((res) => {
            if (res.data.state === 'true') {
              setTimeout(() => {
                this.changeLoading()
                this.showAddModal = false
                this.$Message.success('添加成功')
                this.fetchCompanyList()
              }, 1000)
            } else {
              this.$Message.error('添加企业信息失败')
            }
          }).catch((err) => {
            console.error(err)
            this.$Message.error('请求服务器错误')
            this.changeLoading()
          })
        })
      },
      rowClassName(row, index) {
        console.log('状态颜色',index,row.state)
        if (row.state == 2) {
          return 'demo-table-y-row'
        } else if (row.state == 3) {
          return 'demo-table-r-row'
        }
        return ''
      },
      cdet(e, index) {
        console.log('我的下标是', index, e)
        this.$router.push({
          path: '/insurance/enterprise/cdet',
          query: { value: e.id }
        })
      },
      shen(id) {
        this.shModal = true
        this.shId = id
      },
      remove(id) {
        this.deleteCompanyModal = true
        this.removeId = id
      },
      deleteCancel() { },
      deleteOk() {
        delCompany(this.removeId).then((res) => {
          if (res.data.state === 'true') {
            this.$Message.success('删除成功')
            this.fetchCompanyList()
          } else {
            this.$Message.error('删除操作失败')
          }
        }).catch((err) => {
          console.error(err)
          this.$Message.error('请求服务器异常')
        })
      },
      shenOk() {
        // delCompany(this.removeId).then((res) => {
        //   if (res.data.state === 'true') {
        this.$Message.success('审核成功')
        //     this.fetchCompanyList()
        //   } else {
        //     this.$Message.error('删除操作失败')
        //   }
        // }).catch((err) => {
        //   console.error(err)
        //   this.$Message.error('请求服务器异常')
        // })
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