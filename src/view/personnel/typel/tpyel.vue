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
      <Table highlight-row :loading='loading' size="large" border stripe :columns="columns" :data="tableLisr" @on-row-dblclick="pdet">
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
    <Modal v-model="showAddModal" title="添加保险类型" @on-ok="ok" @on-cancel="cancel" :closable="false" :mask-closable="false"
      ok-text='添加'>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="保险名称" prop="name">
          <Input v-model="formValidate.name" placeholder="输入保险名称"></Input>
        </FormItem>
        <FormItem label="选择种类">
          <RadioGroup v-model="formValidate.radio">
            <Radio label="false">个人保险</Radio>
            <Radio label="true">企业保险</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="showAddModal1" title="修改保险类型" @on-ok="ok1" @on-cancel="cancel1" :closable="false"
      :mask-closable="false" ok-text='修改'>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="保险名称" prop="name">
          <Input v-model="formValidate.name" placeholder="输入保险名称"></Input>
        </FormItem>
        <FormItem label="选择种类">
          <RadioGroup v-model="formValidate.radio">
            <Radio label='false'>个人保险</Radio>
            <Radio label='true'>企业保险</Radio>
          </RadioGroup>
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
  name: 'typel',
  data() {
    return {
      showAddModal: false,
      showAddModal1: false,
      modal1: false,
      total: 0,
      pageSize: 15,
      pageNo: 1,
      columns: [
        {
          tooltip: true,
          align: 'center',
          title: '保险名称',
          key: 'name'
        },
        {
          tooltip: true,
          align: 'center',
          title: '保险类型',
          key: 'typeName'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      tableLisr: [],
      formValidate: {
        id: '',
        name: '',
        radio: 'false',
        typeName: ''
      },
      ruleValidate: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        radio: [{ required: true, message: '请选择权限类别', trigger: 'change' }]
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
    console.log('创建完成')
    console.log('token值', getToken())
    this.tableLisr = []
    let that = this
    axios.request({
      method: 'post',
      url: '/main/instypelist',
      data: {
        page: 1,
        pagesize: 15
      }
    }).then(function (res) {
      console.log('查询返回值', res)
      for (let i = 0; i < res.data.data.length; i++) {
        that.tableLisr.push(res.data.data[i].fields)
        if (that.tableLisr[i].iscompany === true) {
          that.tableLisr[i].typeName = '公司保险'
        } else {
          that.tableLisr[i].typeName = '个人保险'
        }
        that.tableLisr[i].id = res.data.data[i].pk
      }
      that.total = res.data.count
    }).catch(function (error) {
      console.log(error)
    })
    console.log(this.tableLisr)
    this.loading = false
  },
  methods: {
    changePage(page) {
      this.loading = true
      console.log(page)
      this.pageNo = page
      this.loading = false
    },
    pdet(e, index) {
      console.log('我的下标是', index, e)
      // this.showAddModal = true
    },
    cancel() {
      this.$Message.success('点击取消!')
      this.formValidate = {}
      this.formValidate.radio = 'false'
    },
    ok() {
      // this.tableLisr = []
      if (this.formValidate.radio === 'true') {
        this.formValidate.radio = 1
      } else if (this.formValidate.radio === 'false') {
        this.formValidate.radio = 0
      }
      console.log('表单值', this.formValidate)
      let that = this
      axios.request({
        method: 'post',
        url: '/main/addinstype',
        data: {
          name: that.formValidate.name,
          iscompany: that.formValidate.radio
        }
      }).then(function (res) {
        console.log(res)
        if (res.data.state === 'true') {
          that.$Message.success(res.data.msg)
          that.formValidate = {}
          that.formValidate.radio = 'false'

          setTimeout(() => {
            that.$router.go(0)
          }, 300)
        } else {
          that.$Message.error(res.data.msg)
        }
      }).catch(function (error) {
        console.log(error)
      })
      // this.loading = true
      // setTimeout(() => {
      //   axios.request({
      //     method: 'post',
      //     url: '/main/instype',
      //     data: {
      //       page: 1,
      //       pagesize: 15
      //     }
      //   }).then(function (res) {
      //     console.log('查询返回值', res)
      //     for (let i = 0; i < res.data.data.length; i++) {
      //       that.tableLisr.push(res.data.data[i].fields)
      //       if (that.tableLisr[i].iscompany === true) {
      //         that.tableLisr[i].typeName = '公司保险'
      //       } else {
      //         that.tableLisr[i].typeName = '个人保险'
      //       }
      //       that.tableLisr[i].id = res.data.data[i].pk
      //     }
      //     that.total = res.data.count
      //   }).catch(function (error) {
      //     console.log(error)
      //   })
      //   console.log(this.tableLisr)
      //   this.loading = false
      // }, 500)
      // this.formValidate = {}
      // this.formValidate.radio = 'false'
    },
    cancel1() {
      this.$Message.success('点击取消!')
      this.formValidate = {}
      this.formValidate.radio = 'false'
    },
    ok1() {
      let that = this
      // this.tableLisr = []
      if (this.formValidate.radio === 'true') {
        this.formValidate.radio = 1
      } else if (this.formValidate.radio === 'false') {
        this.formValidate.radio = 0
      }
      axios.request({
        method: 'post',
        url: '/main/addinstype',
        data: {
          id: that.formValidate.id,
          name: that.formValidate.name,
          iscompany: that.formValidate.radio
        }
      }).then(function (res) {
        console.log(res)
        if (res.data.state === 'true') {
          that.$Message.success(res.data.msg)

          setTimeout(() => {
            that.$router.go(0)
          }, 300)
        } else {
          that.$Message.error(res.data.msg)
        }
      }).catch(function (error) {
        console.log(error)
      })
      // this.loading = true
      // setTimeout(() => {
      //   axios.request({
      //     method: 'post',
      //     url: '/main/instype',
      //     data: {
      //       page: 1,
      //       pagesize: 15
      //     }
      //   }).then(function (res) {
      //     console.log('查询返回值', res)
      //     for (let i = 0; i < res.data.data.length; i++) {
      //       that.tableLisr.push(res.data.data[i].fields)
      //       if (that.tableLisr[i].iscompany === true) {
      //         that.tableLisr[i].typeName = '公司保险'
      //       } else {
      //         that.tableLisr[i].typeName = '个人保险'
      //       }
      //       that.tableLisr[i].id = res.data.data[i].pk
      //     }
      //     that.total = res.data.count
      //   }).catch(function (error) {
      //     console.log(error)
      //   })
      //   console.log(this.tableLisr)
      //   this.loading = false
      // }, 500)
      // this.loading = false
      // this.formValidate = {}
      // this.formValidate.radio = 'false'
    },
    cancel2() {
      this.$Message.success('点击取消!')
      this.formValidate = {}
      this.formValidate.radio = 'false'
    },
    ok2() {
      let that = this
      axios.request({
        method: 'post',
        url: '/main/delinstype',
        headers: {
          token: getToken(),
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          id: that.tableLisr[this.remov].id
        }
      }).then(function (res) {
        console.log(res)
        if (res.data.state === 'true') {
          that.$Message.success(res.data.msg)
          that.remov = ''

          setTimeout(() => {
            that.$router.go(0)
          }, 300)
        } else {
          that.$Message.error(res.data.msg)
        }
      }).catch(function (error) {
        console.log(error)
      })
      // this.tableLisr.splice(this.remov, 1)
      // this.remov = ''
    },
    show(index) {
      console.log(this.tableLisr[index])
      this.formValidate = this.tableLisr[index]
      this.formValidate.radio = this.tableLisr[index].iscompany.toString()
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
