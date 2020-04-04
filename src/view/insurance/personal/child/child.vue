<template>
  <div>
    <Row :gutter="20">
      <!-- <i-col span="5">
        <Select class="typeSelList" v-model="typeObj">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col> -->
      <i-col span="4">
        <DatePicker :clearable="true" class="typeSelList" type="date" v-model='startData' placeholder="选择开始时间"></DatePicker>
      </i-col>
      <i-col span="4">
        <DatePicker :clearable="true" class="typeSelList" type="date" v-model='endData' placeholder="选择结束时间"></DatePicker>
      </i-col>
      <!-- <i-col span="4">
        <Select placeholder="请选择状态" class="typeSelList" v-model="statusObj">
          <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col> -->
      <!-- <i-col span="24"></i-col>
      <i-col span="4" class="mt20">
        <Select class="typeSelList" v-model="queryObj">
          <Option v-for="item in queryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col> -->
      <i-col span="11"><Input clearable search enter-button="搜索" @on-search='doSearch' class="typeSelList" v-model="queryStr" placeholder="输入内容按回车键查询">
        <!-- <Select v-model="select1" slot="prepend" style="width: 80px">
          <Option value="1">按名称：</Option>
          <Option value="2">按编号：</Option>
        </!-->
        </Input>
      </i-col>
      <i-col span="24"></i-col>
      <i-col span="12" class="mt20">
        <Button type="primary" size="large" @click="showAddModal = true" class="mr15">新增</Button>
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
      <!-- <Table size="large" border stripe highlight-row :columns="columns" :data="tableLisr" @on-row-dblclick="pdet"> -->
      <Table size="large" border stripe highlight-row :columns="columns" :data="tableLisr">
        <template slot-scope="{ row }" slot="id">
          <strong>{{ row.id }}</strong>
        </template>
        <!-- <template slot-scope="{ row }" slot="action">
          <Button type="warning" v-if="isAdmin || iskj" @click="shen(row.id)" style="margin:0 5px;">审核</Button>
          <Button type="error" v-if="isAdmin" @click="remove(row.id)" style="margin:0 5px;">删除</Button>
        </template> -->
      </Table>
    </div>
    <div class="text-right pageList">
      <Page :total="total" @on-change="changePage" :current.sync="pageNo" :page-size="pageSize" show-total show-elevator />
    </div>
    <Modal v-model="showAddModal" title="添加保险合同" @on-ok="ok" @on-cancel="cancel" :styles="{top: '20px'}" :closable="false" :mask-closable="false" width="60%" ok-text='添加' :loading="modalLoading">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <!-- <FormItem label="合同编号" prop="number">
          <Input v-model="formValidate.number" placeholder="输入合同编号"></Input>
        </FormItem> -->
        <FormItem label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="输入被保人姓名"></Input>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input v-model="formValidate.phone" placeholder="输入被保人电话"></Input>
        </FormItem>
        <FormItem label="保险类型" prop="insuranceType">
          <i-col span="10">
            <Select v-model="formValidate.insuranceType" placeholder="选择保险类型" @on-change='chan'>
              <Option v-for="item in insuranceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select></i-col>
          <!-- <i-col span="2" offset="1">保险档次</i-col>
          <i-col span="11">
            <Select v-model="formValidate.level" placeholder="选择保险档次" @on-change='doLevel'>
              <Option v-for="item in formLeval" :value="item.id" :key="item.id">{{ item.label }}</Option>
            </Select></i-col> -->
        </FormItem>
        <FormItem label="合同日期" prop="date">
          <!-- <Row>
            <Col span="15">
            <FormItem prop="date"> -->
          <DatePicker type="date" placeholder="选择日期" v-model="formValidate.date"></DatePicker>
          <!-- </FormItem>
            </Col>
          </Row> -->
        </FormItem>
        <FormItem label="基数" prop="unitPrice">
          <Input v-model="formValidate.unitPrice" placeholder="输入基数（元/月）"></Input>
        </FormItem>
        <FormItem label="购买时长" prop="duration">
          <Input v-model="formValidate.duration" placeholder="输入购买时长（月）"></Input>
        </FormItem>
        <FormItem label="管理费" prop="cost">
          <Input v-model="formValidate.cost" placeholder="输入管理费（元/月）"></Input>
        </FormItem>
        <FormItem label="实际支付" prop="payment">
          <Input v-model="formValidate.payment" placeholder="输入实际支付金额（元）"></Input>
        </FormItem>
        <!-- <FormItem label="合同文件" prop="desc">
          <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048"
                  :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" :data="{token:token}" multiple type="drag"
                  action="http://47.105.49.81:2222/api/main/updataimg" style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <Modal title="合同文件预览" v-model="visible" width='60%' :styles="{top: '20px'}">
            <Carousel v-if="visible" v-model="value1" loop>
              <CarouselItem v-for='(img,index) in uploadList' :key='index'>
                <div class="demo-carousel">
                  <img :src="img.url" style="width: 100%" alt="">
                </div>
              </CarouselItem>
            </Carousel>
          </Modal>
        </FormItem> -->
      </Form>
    </Modal>
    <Modal v-model="deleteInsuModal" title='警告！' @on-ok="deleteOk" @on-cancel="deleteCancel">
      <p>删除后不可恢复，确认删除吗？</p>
    </Modal>
  </div>
</template>

<script>
  import { getToken, formatDate } from '@/libs/util'
  import axios from '@/libs/api.request'
  import { getInsuranceTypes, saveOrModifyInsuranceInfo, deleteInsuranceInfo } from '@/api/insurance'
  export default {
    name: 'child',
    props: ['typeId'],
    data() {
      return {
        deleteCompanyModal: false,
        shId: '',
        deleteInsuModal: false,
        removeId: '',
        value1: 0,
        token: '',
        defaultList: [],
        imgName: '',
        visible: false,
        uploadList: [],
        allowAddImg: true,
        select1: '1',
        startData: '',
        endData: '',
        total: 0,
        pageSize: 15,
        pageNo: 1,
        typeName: '',
        typeEndDate: '',
        typeList: [],
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
          // {
          //   align: 'center',
          //   tooltip: true,
          //   title: '编号',
          //   key: 'id',
          //   maxWidth: 65,
          //   minWidth: 65
          // },
          {
            align: 'center',
            tooltip: true,
            title: '名字',
            key: 'name',
            minWidth: 100,
          },
          {
            align: 'center',
            tooltip: true,
            title: '保险类型',
            key: 'typename',
            minWidth: 100,
            maxwidth: 130
          },
          {
            align: 'center',
            tooltip: true,
            title: '购买日期',
            key: 'buydate',
            width: 130
          },
          {
            align: 'center',
            tooltip: true,
            title: '到期日期',
            key: 'maturitydate',
            width: 130
          },
          {
            align: 'center',
            tooltip: true,
            title: '总金额(元)',
            key: 'cost',
            maxWidth:130,
            minWidth: 100
          },
          {
            align: 'center',
            tooltip: true,
            title: '个人承担(元)',
            key: 'grcd',
            maxWidth:130,
            minWidth: 100
          },
          {
            align: 'center',
            tooltip: true,
            title: '公司承担(元)',
            key: 'gscd',
            maxWidth:130,
            minWidth: 100
          },
          // {
          //   align: 'center',
          //   tooltip: true,
          //   title: '管理费(元)',
          //   key: 'cost',
          //   maxWidth: 130,
          //   minWidth: 100
          // },
          // {
          //   align: 'center',
          //   tooltip: true,
          //   title: '实际支付(元)',
          //   key: 'actualpayment',
          //   maxWidth: 130,
          //   minWidth: 100
          // },
          // {
          //   align: 'center',
          //   tooltip: true,
          //   title: '已使用(元)',
          //   key: 'alreadyused',
          //   maxWidth: 130,
          //   minWidth: 100
          // },
          // {
          //   align: 'center',
          //   tooltip: true,
          //   title: '剩余(元)',
          //   key: 'balance',
          //   maxWidth: 100,
          //   minWidth: 100
          // },
          // {
          //   title: '操作',
          //   slot: 'action',
          //   align: 'center',
          //   maxWidth: 170,
          //   minWidth: 170,
          // }
        ],
        tableLisr: [],
        showAddModal: false,
        modalLoading: true,
        insuranceList: [],
        formValidate: {
          number: '', // 编号
          name: '', // 姓名
          phone: '', // 电话
          insuranceType: '', // 保险类型
          date: '', // 日期
          unitPrice: '', // 单价
          duration: '', // 购买时长
          payment: '', // 实际支付
          cost: '' // 总成本
        },
        ruleValidate: {
          name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
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
              type: 'number',
              required: true,
              message: '请选择保险类型',
              trigger: 'blur'
            }
          ],
          date: [
            {
              required: true,
              type: 'date',
              message: '请选择日期',
              trigger: 'change'
            }
          ],
          cost: [
            {
              required: true,
              message: '保单总成本不能为空',
              trigger: 'blur'
            }
          ]
        },
        formLeval: [],
        levelB: '',
        levelJ: ''
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
        vm.getInsuranceTypes()
        vm.fetchPersonalInfo()
        vm.token = getToken()
      })
    },
    methods: {
      doLevel(res) {
        console.log(';;;;;;;;;;;;;;;;;', res)
        for (let i = 0; i < this.formLeval.length; i++) {
          if (this.formLeval[i].id === res) {
            this.levelB = this.formLeval[i].bili
            this.levelJ = this.formLeval[i].jishu
          }
        }
        console.log('>>>>>>>>', this.levelB, this.levelJ)
      },
      chan(res) {
        console.log('/////////////', res)
        // for (let i = 0; i < this.insuranceList.length; i++) {
        //   if (this.insuranceList[i].value === res) {
        //     this.formLeval = this.insuranceList[i].levellist
        //     for (let j = 0; j < this.formLeval.length; j++) {
        //       this.formLeval[j].label = this.formLeval[j].jishu + ' - ' + this.formLeval[j].bili + '%'
        //     }
        //   }
        // }
      },
      doSearch() {
        console.log('搜索值', this.queryStr, this.startData, this.endData)
        this.loading = true
        let indexs = JSON.stringify(this.startData).indexOf('T')
        let sd = JSON.stringify(this.startData).slice(0, indexs)
        sd =  sd.slice(1,sd.length)
        indexs = JSON.stringify(this.endData).indexOf('T')
        let ed = JSON.stringify(this.endData).slice(0, indexs)
        ed =  ed.slice(1,ed.length)
        this.tableLisr = []
        let that = this
        axios.request({
          method: 'post',
          url: '/main/plistchild',
          data: {
            page: this.pageNo,
            pagesize: this.pageSize,
            typeid: this.typeId,
            name: this.queryStr,
            btime: sd,
            etime: ed
          }
        }).then(function (res) {
          for (let i = 0; i < res.data.data.length; i++) {
            that.tableLisr.push(res.data.data[i].fields)
            that.tableLisr[i].id = res.data.data[i].pk
            let indexs = res.data.data[i].fields.buydate.indexOf('T')
            that.tableLisr[i].buydate = res.data.data[i].fields.buydate.slice(0, indexs)
            indexs = res.data.data[i].fields.maturitydate.indexOf('T')
            that.tableLisr[i].maturitydate = res.data.data[i].fields.maturitydate.slice(0, indexs)
            indexs = res.data.data[i].fields.reminddate.indexOf('T')
            that.tableLisr[i].reminddate = res.data.data[i].fields.reminddate.slice(0, indexs)
          }
          that.total = res.data.count
        }).catch(function (error) {
          console.log(error)
        })
        this.loading = false
      },
      getInsuranceTypes() {
        this.insuranceList = []
        getInsuranceTypes().then((res) => {
          if (res.data.state === 'true') {
            const types = res.data.data
            console.log('返回的保险类型', res)
            for (const type of types) {
              if (!type.iscompany) {
                this.insuranceList.push({
                  value: type.id,
                  label: type.name,
                  levellist: type.levellist
                })
              }
            }
          } else {
            this.$Message.error('保险类型查询异常')
          }
          console.log('*****', this.insuranceList)
        }).catch((err) => {
          console.error(err)
        })
      },
      fetchPersonalInfo() {
        this.loading = true
        this.tableLisr = []
        let that = this
        axios.request({
          method: 'post',
          url: '/main/plistchild',
          data: {
            page: this.pageNo,
            pagesize: this.pageSize,
            typeid: this.typeId
          }
        }).then(function (res) {
          for (let i = 0; i < res.data.data.length; i++) {
            that.tableLisr.push(res.data.data[i].fields)
            that.tableLisr[i].id = res.data.data[i].pk
            let indexs = res.data.data[i].fields.buydate.indexOf('T')
            that.tableLisr[i].buydate = res.data.data[i].fields.buydate.slice(0, indexs)
            indexs = res.data.data[i].fields.maturitydate.indexOf('T')
            that.tableLisr[i].maturitydate = res.data.data[i].fields.maturitydate.slice(0, indexs)
            indexs = res.data.data[i].fields.reminddate.indexOf('T')
            that.tableLisr[i].reminddate = res.data.data[i].fields.reminddate.slice(0, indexs)
          }
          that.total = res.data.count
        }).catch(function (error) {
          console.log(error)
        })
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
          const { number, name, phone, insuranceType, date, unitPrice, duration, payment, cost } = this.formValidate
          const data = {
            // contractnum: number,
            insured: name,
            tel: phone,
            insurancetypeid: insuranceType,
            buydate: formatDate(date, 'yyyy-MM-dd hh:mm'),
            month: duration,
            policyamount: unitPrice,
            bili: this.levelB,
            jishu: this.levelJ,
            actualpayment: payment,
            cost: cost
          }
          saveOrModifyInsuranceInfo(data).then((res) => {
            if (res.data.state === 'true') {
              setTimeout(() => {
                this.changeLoading()
                this.showAddModal = false
                this.$Message.success('添加成功')
                this.fetchPersonalInfo()
              }, 1000)
            } else {
              this.$Message.error('添加保险合同失败')
            }
          }).catch((err) => {
            console.error(err)
            this.$Message.error('请求服务器错误')
            this.changeLoading()
          })
        })
      },
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
      handleSuccess(res, file) {
        console.log('上传后返回信息', res)
        file.url = 'http://47.105.49.81:2222/api/main/getimg' + '/' + res.id + '/' + this.token;
        console.log('图片地址', file.url)
        file.name = res.id;
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 的格式不正确，请选择jpg、jpeg或png格式的图片。'
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件  ' + file.name + ' 超出大小限制，文件最大为2MB。'
        });
      },
      handleBeforeUpload() {
        const check = this.uploadList.length < 5;
        if (!check) {
          this.$Notice.warning({
            title: '最多可以上传5张图片。'
          });
        }
        return check;
      },
      handleRemove(file) {
        console.log(file)
        let that = this
        axios.request({
          method: 'post',
          url: '/main/delimg',
          data: {
            id: file.name,
          }
        }).then(function (res) {
          if (res.data.state === 'true') {
            that.$Message.success(res.data.msg)
          } else {
            that.$Message.error(res.data.msg)
          }
        }).catch(function (error) {
          console.log(error)
        })
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleView(index) {
        console.log(index)
        console.log(this.uploadList)
        for (let i = 0; i < this.uploadList.length; i++) {
          if (this.uploadList[i].name === index) {
            this.value1 = i
            this.visible = true
          }
        }
      },
      shen(id) {
        this.shModal = true
        this.shId = id
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
    },
    mounted() {
      this.uploadList = this.$refs.upload.fileList;
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

  .ivu-table .demo-table-y-row td {
    background-color: rgba(255, 255, 0, 0.5);
    color: rgb(0, 0, 0);
  }

  .ivu-table .demo-table-r-row td {
    background-color: rgb(255, 0, 0, 0.2);
    color: rgb(0, 0, 0);
  }
</style>