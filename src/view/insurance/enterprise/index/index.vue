<style>
  .ivu-table .demo-table-y-row td {
    color: rgba(255, 153, 0, 1);
  }

  .ivu-table .demo-table-r-row td {
    color: rgb(255, 0, 0, 1);
  }
</style>

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
      <i-col span="12" class="mt20"><Input clearable search enter-button class="typeSelList" v-model="queryStr" placeholder="输入内容按回车键查询" /></i-col>
      <i-col span="24"></i-col> -->
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
      <Table size="large" :loading="loading" :row-class-name="rowClassName" border stripe highlight-row :columns="columns" :data="tableLisr" @on-row-dblclick="cdet">
        <template slot-scope="{ row }" slot="id">
          <strong>{{ row.id }}</strong>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button type="warning" v-if="isAdmin || iskj" @click="shen(row.id)" style="margin:0 5px;">审核</Button>
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
        <FormItem label="规模" prop="number">
          <Input v-model="formValidate.number" placeholder="输入公司规模"></Input>
        </FormItem>
        <FormItem label="地址" prop="address">
          <Input v-model="formValidate.address" placeholder="输入公司地址"></Input>
        </FormItem>
        <FormItem label="合同日期">
          <Row>
            <Col span="4">
            <FormItem prop="date">
              <DatePicker type="date" placeholder="选择日期" v-model="formValidate.date"></DatePicker>
            </FormItem>
            </Col>
            <Col span="2" style="text-align: center">结束日期</Col>
            <Col span="4">
            <FormItem prop="stopDate">
              <DatePicker type="date" placeholder="选择日期" v-model="formValidate.stopDate"></DatePicker>
            </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="联系人" prop="manager">
          <Input v-model="formValidate.manager" placeholder="输入公司联系人"></Input>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input v-model="formValidate.phone" placeholder="输入公司电话"></Input>
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
  import { getToken } from '@/libs/util'
  import axios from '@/libs/api.request'
  import { addCompany, delCompany } from '@/api/company'
  export default {
    name: 'enterprise',
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
          manager: [
            {
              required: true,
              message: '联系人不能为空',
              trigger: 'blur'
            }
          ],
          phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
          date: [
            {
              required: true,
              type: 'date',
              message: '请选择日期',
              trigger: 'change'
            }
          ],
          stopDate: [
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
          // {
          //   title: '合同编号',
          //   key: 'id',
          //   align: 'center',
          //   tooltip: true
          // },
          {
            title: '名称',
            key: 'name',
            align: 'center',
            tooltip: true,
            width:240
          },
          {
            title: '地址',
            key: 'addrss',
            align: 'center',
            tooltip: true,
            width:240
          },
          // {
          //   title: '公司规模',
          //   key: 'psize',
          //   align: 'center',
          //   tooltip: true,
          //   width:95
          // },
          {
            title: '合同起始时间',
            key: 'stime',
            align: 'center',
            tooltip: true,
            width:130
          },
          {
            title: '合同结束时间',
            key: 'etime',
            align: 'center',
            tooltip: true,
            width:130
          },
          {
            title: '负责人名字',
            key: 'contactperson',
            align: 'center',
            tooltip: true,
            width:110
          },
          {
            title: '电话',
            key: 'tel',
            align: 'center',
            tooltip: true,
            width:130
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
            width:170
          }
          // {
          //   title: '剩余',
          //   key: 'remaining',
          //   align: 'center',
          //   tooltip: true
          // }
        ],
        tableLisr: [],
        loading: true
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
      this.fetchCompanyList()
    },
    methods: {
      fetchCompanyList() {
        this.loading = true
        this.tableLisr = []
        let that = this
        axios.request({
          method: 'post',
          url: '/main/companylist',
          data: {
            page: this.pageNo,
            pagesize: this.pageSize
          }
        }).then(function (res) {
          console.log('********',res)
          if (res.data.state === 'true') {
            that.total = res.data.count
            for (let i = 0; i < res.data.data.length; i++) {
              that.tableLisr.push(res.data.data[i].fields)
              that.tableLisr[i].id = res.data.data[i].pk
              let indexs = res.data.data[i].fields.stime.indexOf('T')
              that.tableLisr[i].stime = res.data.data[i].fields.stime.slice(0, indexs)
              indexs = res.data.data[i].fields.etime.indexOf('T')
              that.tableLisr[i].etime = res.data.data[i].fields.etime.slice(0, indexs)
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
          const { name, number, address, manager, phone, date, stopDate, desc } = this.formValidate
          const data = {
            name,
            psize: number,
            address,
            stime: date,
            etime: stopDate,
            contactperson: manager,
            tel: phone,
            // remark: desc
          }
          addCompany(data).then((res) => {
            if (res.data.state === 'true') {
              setTimeout(() => {
                this.changeLoading()
                this.showAddModal = false
                this.$Message.success('添加成功')
                this.fetchPersonalInfo()
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
        if (row.state === 2) {
          return 'demo-table-y-row'
        } else if (row.state === 3) {
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
        this.$Message.success('删除成功')
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