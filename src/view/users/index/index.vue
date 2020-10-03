<template>
  <div>
    <Row :gutter="20">
      <i-col span="12" class="mt20">
        <Button type="primary" @click="showAddModal = true" class="mr15">新增</Button>
        <!-- <Button type="warning" class="mr15">删除</Button> -->
        <!-- <Button>导出</Button> -->
      </i-col>
    </Row>
    <div class="tableList">
      <Table highlight-row size="large" border  :columns="columns" :data="tableLisr" @on-row-dblclick="pdet">
        <template slot-scope="{ row }" slot="id">
          <strong>{{ row.id }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" style="margin-right: 15px" v-if="isAdmin" @click="show(index)">修改</Button>
          <Button type="error" v-if="isAdmin" @click="remove(index)">删除</Button>
        </template>
      </Table>
    </div>
    <div class="text-right pageList">
      <Page :total="total" @on-change="changePage" :current.sync="pageNo" :page-size="pageSize" show-total
        show-elevator />
    </div>
    <Modal v-model="showAddModal" title="添加用户" @on-ok="ok" @on-cancel="cancel" :closable="false" :mask-closable="false"
      ok-text='添加'>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="账号" prop="loginname">
          <Input v-model="formValidate.loginname" placeholder="输入用户账号"></Input>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="输入用户姓名"></Input>
        </FormItem>
        <!-- <FormItem label="电话" prop="phone">
          <Input v-model="formValidate.phone" placeholder="输入用户电话"></Input>
        </FormItem> -->
        <!-- <FormItem label="地址" prop="address">
                <Input v-model="formValidate.address" placeholder="输入被保人地址"></Input>
            </FormItem> -->
        <FormItem label="用户权限" prop="roleid">
          <Select v-model="formValidate.roleid" placeholder="选择用户权限">
            <Option v-for="item in tpyeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="用户密码" prop="passwd">
          <Input v-model="formValidate.passwd" type="password" placeholder="输入用户密码"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="showAddModal1" title="修改用户" @on-ok="ok1" @on-cancel="cancel1" :closable="false"
      :mask-closable="false" ok-text='修改'>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="账号" prop="loginname">
          <Input v-model="formValidate.loginname" placeholder="输入账号"></Input>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="输入用户姓名"></Input>
        </FormItem>
        <!-- <FormItem label="电话" prop="phone">
          <Input v-model="formValidate.phone" placeholder="输入用户电话"></Input>
        </FormItem> -->
        <!-- <FormItem label="地址" prop="address">
                <Input v-model="formValidate.address" placeholder="输入被保人地址"></Input>
            </FormItem> -->
        <FormItem label="用户权限" prop="roleid">
          <Select v-model="formValidate.roleid" placeholder="选择用户权限">
            <Option v-for="item in tpyeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="用户密码" prop="passwd">
          <Input v-model="formValidate.passwd" type="password" placeholder="输入用户密码"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="modal1" title='警告！' @on-ok="ok2" @on-cancel="cancel2">
      <p>删除后不可恢复，确认删除吗？</p>
    </Modal>
  </div>
</template>

<script>
import { getToken } from '@/libs/util'
import axios from '@/libs/api.request'
export default {
  name: 'users',
  data() {
    return {
      showAddModal: false,
      showAddModal1: false,
      modal1: false,
      total: 0,
      pageSize: 15,
      pageNo: 1,
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
      columns: [
        {
          tooltip: true,
          align: 'center',
          title: '账号',
          key: 'loginname'
        },
        {
          tooltip: true,
          align: 'center',
          title: '密码',
          key: 'passwd'
        },
        {
          tooltip: true,
          align: 'center',
          title: '姓名',
          key: 'name'
        },
        {
          tooltip: true,
          align: 'center',
          title: '用户组',
          key: 'rolename'
        },
        {
          tooltip: true,
          align: 'center',
          title: '用户组ID',
          key: 'roleid'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      tableLisr: [],
      tpyeList: [
        {
          value: '1',
          label: '超级管理员'
        },
        {
          value: '2',
          label: '管理员'
        },
        {
          value: '3',
          label: '业务员'
        }
      ],
      formValidate: {
        id: '',
        name: '',
        passwd: '',
        roleid: '',
        loginname: ''
      },
      ruleValidate: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        passwd: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }
        ],
        loginname: [
          {
            required: true,
            message: '账号不能为空',
            trigger: 'blur'
          }
        ],
        phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
        type: [
          {
            required: true,
            message: '请选择权限类别',
            trigger: 'change'
          }
        ]
      },
      remov: ''
    }
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.access.indexOf('superadmin') >= 0 
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.tableLisr = []
      let that = this
      this.loading = true
      axios.request({
        method: 'post',
        url: '/allUser',
        data: {
          page: this.pageNo,
          pagesize: this.pageSize
        }
      }).then(function (res) {
        for (let i = 0; i < res.data.data.length; i++) {
          that.tableLisr.push(res.data.data[i].fields)
          that.tableLisr[i].id = res.data.data[i].pk
        }
        that.total = res.data.count
      }).catch(function (error) {
        console.log(error)
      })
      this.loading = false
    },
    changePage(page) {
      this.pageNo = page
      this.fetchList()
    },
    pdet(e, index) {
      console.log('我的下标是', index, e)
      // this.showAddModal = true
    },
    cancel() {
      this.$Message.success('点击取消!')
      this.formValidate = {}
    },
    ok() {
      console.log(this.formValidate)
      let that = this
      axios.request({
        method: 'post',
        url: '/addUser',
        data: {
          loginname: that.formValidate.loginname,
          passwd: that.formValidate.passwd,
          name: that.formValidate.name,
          roleid: that.formValidate.roleid,
          companyid: 1
        }
      }).then(function (res) {
        console.log(res)
        if (res.data.state === 'true') {
          that.$Message.success(res.data.msg)
          that.fetchList()
        } else {
          that.$Message.success(res.data.msg)
        }
      }).catch(function (error) {
        console.log(error)
      })
      this.formValidate = {}
    },
    cancel1() {
      this.$Message.success('点击取消!')
      this.formValidate = {}
    },
    ok1() {
      let that = this
      axios.request({
        method: 'post',
        url: '/addUser',
        data: {
          id: that.formValidate.id,
          loginname: that.formValidate.loginname,
          passwd: that.formValidate.passwd,
          name: that.formValidate.name,
          roleid: that.formValidate.roleid,
          companyid: 1
        }
      }).then(function (res) {
        console.log(res)
        if (res.data.state === 'true') {
          that.$Message.success(res.data.msg)
          that.fetchList()
        } else {
          that.$Message.success(res.data.msg)
        }
      }).catch(function (error) {
        console.log(error)
      })
      this.formValidate = {}
    },
    cancel2() {
      this.$Message.success('点击取消!')
      this.formValidate = {}
    },
    ok2() {
      let that = this
      axios.request({
        method: 'post',
        url: '/delUser',
        data: {
          id: that.tableLisr[this.remov].id
        }
      }).then(function (res) {
        console.log(res)
        if (res.data === true) {
          that.$Message.success(res.data.msg)
        } else {
          that.$Message.success(res.data.msg)
        }
      }).catch(function (error) {
        console.log(error)
      })
      this.tableLisr.splice(this.remov, 1)
      this.remov = ''
    },
    show(index) {
      this.formValidate = this.tableLisr[index]
      this.showAddModal1 = true
    },
    remove(index) {
      this.modal1 = true
      this.remov = index
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
