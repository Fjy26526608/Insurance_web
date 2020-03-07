<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    <Row>
      <Col span="16">
      <FormItem label="合同编号" prop="number">
        <Input v-model="formValidate.number" placeholder="输入合同编号" :disabled="!isChange"></Input>
      </FormItem>
      <FormItem label="姓名" prop="name">
        <Input v-model="formValidate.name" placeholder="输入被保人姓名" :disabled="!isChange"></Input>
      </FormItem>
      <FormItem label="电话" prop="phone">
        <Input v-model="formValidate.phone" placeholder="输入被保人电话" :disabled="!isChange"></Input>
      </FormItem>
      <FormItem label="保险类型" prop="insuranceType">
        <Select v-model="formValidate.insuranceType" placeholder="选择保险类型" :disabled="!isChange">
          <Option v-for="item in insuranceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="合同日期">
        <Row>
          <Col span="5">
          <FormItem prop="date">
            <DatePicker type="date" placeholder="选择日期" v-model="formValidate.date" :disabled="!isChange"></DatePicker>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="成本单价" prop="unitPrice">
        <Input v-model="formValidate.unitPrice" placeholder="输入成本单价（月/元）" :disabled="!isChange"></Input>
      </FormItem>
      <FormItem label="购买时长" prop="duration">
        <Input v-model="formValidate.duration" placeholder="输入购买时长（月）" :disabled="!isChange"></Input>
      </FormItem>
      <FormItem label="保单总成本" prop="cost">
        <Input v-model="formValidate.cost" placeholder="输入保单总成本金额（元）" :disabled="!isChange"></Input>
      </FormItem>
      <FormItem label="实际支付" prop="payment">
        <Input v-model="formValidate.payment" placeholder="输入实际支付金额（元）" :disabled="!isChange"></Input>
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
              :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" :data="{number:formValidate.number,token:token}" multiple type="drag"
              action="http://47.105.49.81:2222/api/main/updataimg" style="display: inline-block;width:58px;" :disabled="!isChange">
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
      </Col>
    </Row>
    <FormItem>
      <Button size="large" icon="md-checkmark" type="success" @click="handleSubmit('formValidate')" v-if="isChange">递 交</Button>
      <Button icon="md-create" size="large" type="primary" @click="doChange()" style="margin-left: 8px" v-if="isAdmin && !isChange">修 改</Button>
    </FormItem>
  </Form>
</template>
<script>
  import { getToken } from '@/libs/util'
  import axios from '@/libs/api.request'
  import { getInsuranceTypes, getInsuranceInfo, saveOrModifyInsuranceInfo } from '@/api/insurance'
  import { formatDate } from '@/libs/util'
  export default {
    data() {
      return {
        id: '',
        token: '',
        value1: 0,
        visible: false,
        uploadList: [],
        defaultList: [],
        imgData: '',
        imgArr: [],
        imgSrc: '',
        allowAddImg: true,
        isChange: false,
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
              type: 'number',
              required: true,
              message: '成本单价不能为空',
              trigger: 'blur'
            }
          ],
          duration: [
            {
              type: 'number',
              required: true,
              message: '购买时长不能为空',
              trigger: 'blur'
            }
          ],
          payment: [
            {
              type: 'number',
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
              type: 'number',
              required: true,
              message: '保单总成本不能为空',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    computed: {
      isAdmin() {
        return this.$store.state.user.access.indexOf('superadmin') >= 0
      }
    },
    created() {
      this.id = this.$route.query.id
      this.token = getToken()
      // 查询保险类型
      this.getInsuranceTypes()
      // 查询保险详情
      this.getInsuranceInfo()
      let that = this
      axios.request({
        method: 'post',
        url: '/main/getimglist',
        data: {
          number: that.formValidate.number
        }
      }).then(function (res) {
        console.log('请求返回后的企业合同图片', res)
        let b=[]
        that.defaultList=[]
        for (let i = 0; i < 9; i++) {
          b.push(res.data.data[i])
          b[i].name = res.data.data[i].pk
          b[i].url = 'http://47.105.49.81:2222/api/main/getimg/' + res.data.data[i].pk + '/' + that.token;
          that.defaultList.push({})
          that.defaultList[i].name=b[i].name
          that.defaultList[i].url=b[i].url
        }
        console.log('处理后的请求企业合同图片', that.defaultList)
      }).catch(function (error) {
        console.log(error)
      })
    },
    methods: {
      getInsuranceTypes() {
        getInsuranceTypes().then((res) => {
          if (res.data.state === 'true') {
            const types = res.data.data
            for (const type of types) {
              if (!type.fields.iscompany) {
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
      getInsuranceInfo() {
        getInsuranceInfo(this.id).then((res) => {
          if (res.data.state === 'true') {
            const info = res.data.data[0].fields
            this.formValidate = {
              number: info.contractnum, // 编号
              name: info.insured, // 姓名
              phone: info.tel, // 电话
              insuranceType: info.insurancetypeid, // 保险类型
              date: info.buydate, // 日期
              unitPrice: info.policyamount, // 单价
              duration: info.month, // 购买时长
              payment: info.actualpayment, // 实际支付
              cost: info.cost // 总成本
            }
          } else {
            this.$Message.error('保险详情查询异常')
          }
        }).catch((err) => {
          console.error(err)
        })
      },
      handleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            const { number, name, phone, insuranceType, date, unitPrice, duration, payment, cost } = this.formValidate
            const data = {
              id: this.id,
              contractnum: number,
              insured: name,
              tel: phone,
              insurancetypeid: insuranceType,
              buydate: formatDate(date, 'yyyy-MM-dd hh:mm'),
              month: duration,
              policyamount: unitPrice,
              cost,
              actualpayment: payment
            }
            saveOrModifyInsuranceInfo(data).then((res) => {
              if (res.data.state === 'true') {
                this.$Message.success('修改成功!')
                this.isChange = false
              } else {
                this.$Message.error('修改信息失败')
              }
            }).catch((err) => {
              console.error(err)
              this.$Message.error('请求服务器异常')
            })
          } else {
            this.$Message.error('数据填写不正确!')
          }
        })
      },
      doChange() {
        this.isChange = true
      },
      doNew() {
        this.$Message.success('点击新增!')
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
        const check = this.uploadList.length < 50;
        if (!check) {
          this.$Notice.warning({
            title: '最多可以上传50张图片。'
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