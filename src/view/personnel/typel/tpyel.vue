<template>
  <div>
    <Row :gutter="20">
      <i-col span="12" class="mt20">
        <Button type="primary" @click="showAdd" class="mr15">新增</Button>
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
      <Page :total="total" @on-change="changePage" :current.sync="pageNo" :page-size="pageSize" show-total show-elevator />
    </div>
    <Modal v-model="showAddModal" title="添加保险类型" @on-ok="ok" @on-cancel="cancel" :closable="false" :styles="{top: '20px'}" :mask-closable="false" ok-text='添加' width='50%'>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
        <FormItem label="保险名称:" prop="name">
          <Input v-model="formValidate.name" placeholder="输入保险名称"></Input>
        </FormItem>
        <FormItem label="选择种类:">
          <RadioGroup v-model="formValidate.radio">
            <Radio label="false">个人保险</Radio>
            <Radio label="true">企业保险</Radio>
          </RadioGroup>
        </FormItem>
        <Form ref="formDynamic" :model="formDynamic" :label-width="90">
          <FormItem v-for="(item, index) in formDynamic.items" :key="index" :label="'保险属性 ' + item.index + ':'" :prop="'items.' + index + '.bili'"
                    :rules="{required: true, message: '值不能为空', trigger: 'blur'}">
            <Row>
              <Col span="2">比例：</Col>
              <Col span="5">
              <Input type="text" v-model="item.bili" placeholder="保险比例"></Input>
              </Col>
              <Col span="2" offset="1">基数：</Col>
              <Col span="5">
              <Input type="text" v-model="item.jishu" placeholder="保险基数"></Input>
              </Col>
              <Col span="3" offset="1">
              <Button @click="handleRemove(index)">删除</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row>
              <Col span="4">
              <Button type="dashed" long @click="handleAdd" icon="md-add">增加属性</Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Form>
    </Modal>
    <Modal v-model="showAddModal1" title="修改保险类型" @on-ok="ok1" @on-cancel="cancel1" :styles="{top: '20px'}" :closable="false" :mask-closable="false" ok-text='修改' width='50%'>
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
        <Form ref="formDynamic" :model="formDynamic" :label-width="90">
          <FormItem v-for="(item, index) in formDynamic.items" :key="index" :label="'保险属性 ' + item.index + ':'" :prop="'items.' + index + '.bili'"
                    :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
            <Row>
              <Col span="2">比例：</Col>
              <Col span="5">
              <Input type="text" v-model="item.bili" placeholder="保险比例"></Input>
              </Col>
              <Col span="2" offset="1">基数：</Col>
              <Col span="5">
              <Input type="text" v-model="item.jishu" placeholder="保险基数"></Input>
              </Col>
              <Col span="3" offset="1">
              <Button @click="handleRemove(index)">删除</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row>
              <Col span="4">
              <Button type="dashed" long @click="handleAdd" icon="md-add">增加属性</Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
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
        index: 0,
        formDynamic: {
          items: [
            {
              bili: '',
              index: 1,
              jishu: ''
            }
          ]
        },
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
      this.fetchList()
    },
    methods: {
      showAdd(){
        this.showAddModal=true
        this.formDynamic.items=[]
        this.index=0
      },
      handleAdd() {
        this.index++;
        this.formDynamic.items.push({
          bili: '',
          index: this.index,
          jishu: ''
        });
      },
      handleRemove(index) {
        this.formDynamic.items.splice(index,1)
        for(let i = 0;i<this.formDynamic.items.length;i++){
          this.formDynamic.items[i].index=i+1
          this.index=i+1
        }
        console.log('删除后的',index,this.formDynamic.items)
      },
      fetchList() {
        this.tableLisr = []
        let that = this
        this.loading = true
        axios.request({
          method: 'post',
          url: '/main/instypelist',
          data: {
            page: this.pageNo,
            pagesize: this.pageSize
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
        this.formValidate.radio = 'false'
      },
      ok() {
        // this.tableLisr = []
        if (this.formValidate.radio === 'true') {
          this.formValidate.radio = 1
        } else if (this.formValidate.radio === 'false') {
          this.formValidate.radio = 0
        }
        console.log('表单值', this.formValidate,this.formDynamic.items)
        let that = this
        let tp=JSON.stringify(this.formDynamic.items)
        console.log('转码后的数组',tp)
        axios.request({
          method: 'post',
          url: '/main/addinstype',
          data: {
            name: that.formValidate.name,
            iscompany: that.formValidate.radio,
            length:that.formDynamic.items.length,
            data:tp
          }
        }).then(function (res) {
          console.log(res)
          if (res.data.state === 'true') {
            that.$Message.success(res.data.msg)
            that.formValidate = {}
            that.formValidate.radio = 'false'

            setTimeout(() => {
              // that.$router.go(0)
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