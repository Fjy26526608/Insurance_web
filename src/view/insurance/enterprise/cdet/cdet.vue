<template>
  <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="80">
    <Row>
      <Col span="18">
      <FormItem label="名称" prop="name">
        <Input v-model="formValidate2.name" placeholder="输入公司名称" :disabled="!isChange"></Input>
      </FormItem>
      <FormItem label="规模" prop="psize">
        <Input v-model="formValidate2.psize" placeholder="输入公司规模" :disabled="!isChange"></Input>
      </FormItem>
      <FormItem label="地址" prop="address">
        <Input v-model="formValidate2.address" placeholder="输入公司地址" :disabled="!isChange"></Input>
      </FormItem>
      <FormItem label="合同日期">
        <Row>
          <Col span="2">
          <FormItem prop="stime">
            <DatePicker type="date" placeholder="选择日期" v-model="formValidate2.stime" :disabled="!isChange"></DatePicker>
          </FormItem>
          </Col>
          <Col span="2" style="text-align: center">结束日期</Col>
          <Col span="2">
          <FormItem prop="dtime">
            <DatePicker type="date" placeholder="选择日期" v-model="formValidate2.etime" :disabled="!isChange"></DatePicker>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="联系人" prop="contactperson">
        <Input v-model="formValidate2.contactperson" placeholder="输入公司联系人" :disabled="!isChange"></Input>
      </FormItem>
      <FormItem label="电话" prop="tel">
        <Input v-model="formValidate2.tel" placeholder="输入公司电话" :disabled="!isChange"></Input>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input v-model="formValidate2.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入备注..." :disabled="!isChange"></Input>
      </FormItem>
      </Col>
      <Col span="1" style='text-align:center'>合同照片</Col>
      <Col span="5">
      <div class="demo-upload-list" v-for="item in uploadList">
        <template v-if="item.status === 'finished'">
          <img :src="item.url">
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
            <Icon type="ios-trash-outline" v-if="isAdmin" @click.native="handleRemove(item)"></Icon>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
      </div>
      <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" :data="{companyid:formValidate2.id,token:token}" multiple type="drag"
              action="http://47.105.49.81:2222/api/main/updataimg" style="display: inline-block;width:58px;" :disabled="!isChange">
        <div style="width: 58px;height:58px;line-height: 58px;">
          <Icon type="ios-camera" size="20"></Icon>
        </div>
      </Upload>
      <Modal title="合同文件预览" v-model="visible" width='60%' :styles="{top: '20px'}">
        <!-- <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%"> -->
        <Carousel v-if="visible" v-model="value1" loop>
          <CarouselItem v-for='(img,index) in uploadList' :key='index'>
            <div class="demo-carousel">
              <img :src="img.url" style="width: 100%" alt="">
            </div>
          </CarouselItem>
        </Carousel>
      </Modal>
      </Col>
    </Row>
    <FormItem>
      <Button size="large" icon="md-checkmark" type="success" @click="handleSubmit('formValidate2')" v-if="isChange">递 交</Button>
      <!-- <Button @click="handleReset('formValidate')" style="margin-left: 8px" v-if="isChange">重 置</Button> -->
      <Button icon="md-create" size="large" type="primary" v-if="isAdmin" @click="doChange" style="margin-left: 8px">修 改</Button>
    </FormItem>
    <Button size="large" icon="md-add" type="success" @click="showAddModal = true" style="margin:4px">新增保单</Button>
    <div class="tableList">
      <Table size="large" border stripe highlight-row :columns="columns" :data="tableLisr" @on-row-dblclick="pdet">
        <template slot-scope="{ row }" slot="id">
          <strong>{{ row.id }}</strong>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button type="error" @click="remove(row.id)">删除</Button>
        </template>
      </Table>
    </div>
    <div class="text-right pageList">
      <Page :total="total" @on-change="changePage" :current.sync="pageNo" :page-size="pageSize" show-total show-elevator />
    </div>
    <Modal v-model="showAddModal" title="添加保险合同" @on-ok="ok" @on-cancel="cancel" :closable="false" :mask-closable="false" width="60%" ok-text='添加' :loading="modalLoading">
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
        <FormItem label="保险类型" prop="insuranceType">
          <Select v-model="formValidate.insuranceType" placeholder="选择保险类型">
            <Option v-for="item in insuranceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="合同日期">
          <Row>
            <Col span="5">
            <FormItem prop="date">
              <DatePicker type="date" placeholder="选择日期" v-model="formValidate.date"></DatePicker>
            </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="成本单价" prop="unitPrice">
          <Input v-model="formValidate.unitPrice" placeholder="输入成本单价（月/元）"></Input>
        </FormItem>
        <FormItem label="购买时长" prop="duration">
          <Input v-model="formValidate.duration" placeholder="输入购买时长（月）"></Input>
        </FormItem>
        <FormItem label="保单总成本" prop="cost">
          <Input v-model="formValidate.cost" placeholder="输入保单总成本金额（元）"></Input>
        </FormItem>
        <FormItem label="实际支付" prop="payment">
          <Input v-model="formValidate.payment" placeholder="输入实际支付金额（元）"></Input>
        </FormItem>
        <FormItem label="合同文件" prop="desc">
          <div class="demo-upload-list" v-for="item in uploadList2">
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
          <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList2" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048"
                  :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" :data="{companyid:formValidate2.id,token:token}" multiple type="drag"
                  action="http://47.105.49.81:2222/api/main/updataimg" style="display: inline-block;width:58px;" >
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <Modal title="合同文件预览" v-model="visible" width='60%' :styles="{top: '20px'}">
            <Carousel v-if="visible" v-model="value1" loop>
              <CarouselItem v-for='(img,index) in uploadList2' :key='index'>
                <div class="demo-carousel">
                  <img :src="img.url" style="width: 100%" alt="">
                </div>
              </CarouselItem>
            </Carousel>
          </Modal>
        </FormItem>
      </Form>
    </Modal>
  </Form>
</template>
<script>
  import { getToken,formatDate  } from '@/libs/util'
  import axios from '@/libs/api.request'
  import { getInsuranceTypes,saveOrModifyInsuranceInfo  } from '@/api/insurance'
  export default {
    data() {
      return {
        value1: 0,
        defaultList: [],
        defaultList2: [],
        imgName: '',
        visible: false,
        uploadList: [],
        uploadList2: [],
        imgData: '',
        imgSrc: '',
        allowAddImg: true,
        allowAddImg2: true,
        showAddModal: false,
        modalLoading: true,
        isChange: false,
        formValidate2: {
          name: '',
          number: '',
          address: '',
          manager: '',
          phone: '',
          mail: '',
          city: '',
          gender: '',
          interest: [],
          date: '',
          time: '',
          desc: ''
        },
        total: 0,
        pageSize: 15,
        pageNo: 1,
        token: '',
        columns: [
          {
            align: 'center',
            tooltip: true,
            title: '合同编号',
            key: 'contractnum'
          },
          {
            align: 'center',
            tooltip: true,
            title: '名称',
            key: 'insured'
          },
          {
            align: 'center',
            tooltip: true,
            title: '保险类型',
            key: 'insurancetypename'
          },
          {
            align: 'center',
            tooltip: true,
            title: '购买日期',
            key: 'buydate'
          },
          {
            align: 'center',
            tooltip: true,
            title: '金额',
            key: 'je'
          },
          {
            align: 'center',
            tooltip: true,
            title: '到期日期',
            key: 'maturitydate'
          },
          {
            align: 'center',
            tooltip: true,
            title: '手续费',
            key: 'cost'
          },
          {
            align: 'center',
            tooltip: true,
            title: '实际支付',
            key: 'actualpayment'
          },
          {
            align: 'center',
            tooltip: true,
            title: '已使用',
            key: 'alreadyused'
          },
          {
            align: 'center',
            tooltip: true,
            title: '剩余',
            key: 'balance'
          }
        ],
        tableLisr: [],
        ruleValidate2: {
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
          contactperson: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
          tel: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
          // mail: [{ required: true, message: '邮箱不能为空', trigger: 'blur' },
          //     { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
          // gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
          sdate: [{ required: true, type: "date", message: "请选择日期", trigger: "change" }],
          edate: [{ required: true, type: "date", message: "请选择日期", trigger: "change" }],
        },
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
        getValue: ''
      }
    },
    computed: {
      isAdmin() {
        return this.$store.state.user.access.indexOf('superadmin') >= 0
      }
    },
    created() {
      console.log('创建完成')
      console.log('接收的参数', this.$route.query.value)
      this.getValue = this.$route.query.value
      this.token = getToken()
      console.log('token值', this.token)
      let that = this
      axios.request({
        method: 'post',
        url: '/main/companyinfo',
        data: {
          id: that.getValue
        }
      }).then(function (res) {
        console.log('请求企业信息返回值', res)
        for (let i = 0; i < res.data.inslist.length; i++) {
          that.tableLisr.push(res.data.inslist[i].fields)
          that.tableLisr[i].id = res.data.inslist[i].pk
          let indexs = res.data.inslist[i].fields.buydate.indexOf('T')
          that.tableLisr[i].buydate = res.data.inslist[i].fields.buydate.slice(0, indexs)
          indexs = res.data.inslist[i].fields.maturitydate.indexOf('T')
          that.tableLisr[i].maturitydate = res.data.inslist[i].fields.maturitydate.slice(0, indexs)
          indexs = res.data.inslist[i].fields.reminddate.indexOf('T')
          that.tableLisr[i].reminddate = res.data.inslist[i].fields.reminddate.slice(0, indexs)
        }
        console.log('返回处理企业后下表', that.tableLisr)
        that.total = res.data.count
        that.formValidate2 = res.data.data[0].fields
        that.formValidate2.id = res.data.data[0].pk
        console.log('返回处理后的企业信息', that.formValidate2)
      }).catch(function (error) {
        console.log(error)
      })
      axios.request({
        method: 'post',
        url: '/main/getimg',
        data: {
          companyid: that.getValue
        }
      }).then(function (res) {
        console.log('请求返回后的企业合同图片', res)
        that.defaultList = res.data
      }).catch(function (error) {
        console.log(error)
      })

    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getInsuranceTypes()
      })
    },
    methods: {
      getInsuranceTypes() {
        getInsuranceTypes().then((res) => {
          if (res.data.state === 'true') {
            this.insuranceList = []
            const types = res.data.data
            for (const type of types) {
              if (type.fields.iscompany) {
                this.insuranceList.push({
                  value: type.pk,
                  label: type.fields.name
                })
              }
            }
          } else {
            this.$Message.error('保险类型查询异常')
          }
        }).catch((err) => {
          console.error(err)
        })
      },
      changeLoading() {
        this.modalLoading = false
        this.$nextTick(() => {
          this.modalLoading = true
        })
      },
      doChange() {
        this.isChange = !this.isChange
      },
      handleSubmit(res) {
        // this.$refs[res].Validate(valid => {
        //   if (valid) {
        let that = this
        axios.request({
          method: 'post',
          url: '/main/addcompany',
          data: {
            id: that.formValidate2.id,
            name: that.formValidate2.name,
            psize: that.formValidate2.psize,
            address: that.formValidate2.address,
            stime: that.formValidate2.stime,
            etime: that.formValidate2.etime,
            contactperson: that.formValidate2.contactperson,
            tel: that.formValidate2.tel,
            remark: that.formValidate2.remark
          }
        }).then(function (res) {
          console.log('修改', res)
          if (res.data.state === 'true') {
            that.$Message.success(res.data.msg)
          } else {
            that.$Message.error(res.data.msg)
          }
        }).catch(function (error) {
          console.log(error)
        })

        // } else {
        //   this.$Message.error('数据填写不正确!')
        // }
        // })
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      doNew() {
        this.$Message.success('点击新增!')
      },
      pdet(e, index) {
        console.log('我的下标是', index, e)
        this.$router.push({
          path: '/insurance/personal/pdet',
          query: { id: e.id }
        })
      },
      changePage(page) {
        // alert(page)
      },
      cancel() {
        this.$Message.success('点击取消!')
      },
      ok() {
        this.$refs['formValidate'].validate((valid) => {
          if (!valid) {
            return this.changeLoading()
          }
          // 请求服务端添加接口
          const { number, name, phone, insuranceType, date, unitPrice, duration, payment, cost } = this.formValidate
          const data = {
            contractnum: number,
            insured: name,
            tel: phone,
            insurancetypeid: insuranceType,
            buydate: formatDate(date, 'yyyy-MM-dd hh:mm'),
            month: duration,
            policyamount: unitPrice,
            cost,
            actualpayment: payment,
            companyid: this.getValue
          }
          console.log(data)
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
      }
    },
    mounted() {
      this.uploadList = this.$refs.upload.fileList;
    }
  }
</script>

<style>
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