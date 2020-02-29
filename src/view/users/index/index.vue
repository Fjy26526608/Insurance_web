<template>
  <div>
    <Row :gutter="20">
      <i-col span="12" class="mt20">
        <Button type="primary" @click="showAddModal = true" class="mr15">新增</Button>
        <Button type="warning" class="mr15">删除</Button>
        <!-- <Button>导出</Button> -->
      </i-col>
    </Row>
    <div class="tableList">
      <Table highlight-row size="large" border stripe :columns="columns" :data="tableLisr" @on-row-dblclick="pdet">
        <template slot-scope="{ row }" slot="id">
          <strong>{{ row.id }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" style="margin-right: 15px" @click="show(index)">修改</Button>
          <Button type="error" @click="remove(index)">删除</Button>
        </template>
      </Table>
    </div>
    <div class="text-right pageList">
      <Page :total="total" @on-change="changePage" :current.sync="pageNo" :page-size="pageSize" show-total show-elevator />
    </div>
    <Modal v-model="showAddModal" title="添加用户" @on-ok="ok" @on-cancel="cancel" :closable="false" :mask-closable="false" ok-text='添加'>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="输入用户姓名"></Input>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input v-model="formValidate.phone" placeholder="输入用户电话"></Input>
        </FormItem>
        <!-- <FormItem label="地址" prop="address">
                <Input v-model="formValidate.address" placeholder="输入被保人地址"></Input>
            </FormItem> -->
        <FormItem label="用户权限" prop="type">
          <Select v-model="formValidate.type" placeholder="选择用户权限">
            <Option v-for="item in tpyeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="用户密码" prop="passwo">
          <Input v-model="formValidate.passwo" placeholder="输入用户密码"></Input>
        </FormItem>
        <FormItem label="用户密码" prop="repasswd">
          <Input v-model="formValidate.repasswd" placeholder="重复输入用户密码"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="showAddModal1" title="修改用户" @on-ok="ok1" @on-cancel="cancel1" :closable="false" :mask-closable="false" ok-text='添加'>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="输入用户姓名"></Input>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input v-model="formValidate.phone" placeholder="输入用户电话"></Input>
        </FormItem>
        <!-- <FormItem label="地址" prop="address">
                <Input v-model="formValidate.address" placeholder="输入被保人地址"></Input>
            </FormItem> -->
        <FormItem label="用户权限" prop="type">
          <Select v-model="formValidate.type" placeholder="选择用户权限">
            <Option v-for="item in tpyeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="用户密码" prop="passwo">
          <Input v-model="formValidate.passwo" placeholder="输入用户密码"></Input>
        </FormItem>
        <FormItem label="用户密码" prop="repasswd">
          <Input v-model="formValidate.repasswd" placeholder="重复输入用户密码"></Input>
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
import axios from 'axios'
export default {
  name: 'users',
  data() {
    return {
      showAddModal: false,
      showAddModal1: false,
      modal1: false,
      total: 10,
      pageSize: 5,
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
          key: 'id'
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
          title: '权限',
          key: 'type'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      tableLisr: [
        {
          id: '2051654',
          name: '山东如意集团',
          phone: 15866666666,
          type: '1'
        },
        {
          id: '2051654',
          name: '山东如意集团',
          phone: 15866666666,
          type: '2'
        },
        {
          id: '2051654',
          name: '山东如意集团',
          phone: 15866666666,
          type: '3'
        }
      ],
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
        name: '', // 姓名
        phone: '', // 电话
        type: '', // 保险类型
        passwd: '', // 性别
        repasswd: '' // 日期
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
        repasswd: [
          {
            required: true,
            message: '密码不能为空',
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
  created() {
    console.log('接收的参数', this.$route.query.type)
    this.total = this.tableLisr.length
    // for (let i = 0; i < 15; i++) {
    //   this.tableLisr[i] = this.tableLisr1[i]
    // }
    axios({
      method: 'post',
      url: 'http://47.105.49.81:2222/main/allUser',
      headers: {
        token: getToken(),
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        pagem: 1,
        pagesize: 15
        // iscompany: true
      }
    }).then(function (response) {
      console.log(response)
    }).catch(function (error) {
      console.log(error)
    })
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
      this.showAddModal = true
    },
    cancel() {
      this.$Message.success('点击取消!')
      this.formValidate = []
    },
    ok() {
      this.$Message.success('点击确定!')
      this.formValidate = []
    },
    cancel1() {
      this.$Message.success('点击取消!')
      this.formValidate = []
    },
    ok1() {
      this.$Message.success('点击确定!')
      this.formValidate = []
    },
    cancel2() {
      this.$Message.success('点击取消!')
    },
    ok2() {
      this.$Message.success('点击确定!')
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
