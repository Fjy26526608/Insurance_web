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
      <div class="com-upload-img">
        <div class="img_group">
          <div class="img_box" v-if="allowAddImg">
            <input type="file" accept="image/*" multiple="multiple" @change="changeImg($event)" v-if='isChange'>
            <div class="filter"></div>
          </div>
          <div class="demo-upload-list" v-for="(item,index) in imgArr" :key='index'>
            <img :src="item" alt="">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(index)"></Icon>
              <Icon type="ios-trash-outline" @click.native="deleteImg(index)"></Icon>
            </div>
          </div>
          <!-- <Row>
            <div class="img_box" v-for="(item,index) in imgArr" :key="index">
              <Col span="4">
              <div class="img_show_box">
                <img :src="item" alt="">
                <i class="img_delete" @click="deleteImg(index)"></i>
                </img>
              </div>
              </Col>
            </div>
          </Row> -->
        </div>
        <Modal title="合同文件预览" v-model="visible" width='60%' :styles="{top: '20px'}">
          <!-- <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%"> -->
          <Carousel v-model="value1" loop>
            <CarouselItem v-for='(img,index) in imgArr' :key='index'>
              <div class="demo-carousel">
                <img :src="img" style="width: 100%" alt="">
              </div>
            </CarouselItem>
          </Carousel>
        </Modal>
      </div>
      </Col>
    </Row>
    <FormItem>
      <Button size="large" icon="md-checkmark" type="success" @click="handleSubmit('formValidate2')" v-if="isChange">递 交</Button>
      <!-- <Button @click="handleReset('formValidate')" style="margin-left: 8px" v-if="isChange">重 置</Button> -->
      <Button icon="md-create" size="large" type="primary" @click="doChange" style="margin-left: 8px">修 改</Button>
    </FormItem>
    <Button size="large" icon="md-add" type="success" @click="showAddModal = true" style="margin:4px">新增保单</Button>
    <div class="tableList" style="margin:4px">
      <Table size="large" border stripe :columns="columns" :data="tableLisr" @on-row-dblclick="pdet"></Table>
    </div>
    <div class="text-right pageList">
      <Page :total="total" @on-change="changePage" :current.sync="pageNo" :page-size="pageSize" show-total show-elevator />
    </div>
    <Modal v-model="showAddModal" title="添加保险合同" @on-ok="ok" @on-cancel="cancel" :closable="false" :mask-closable="false" width="60%" ok-text='添加'>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="合同编号" prop="number">
          <Input v-model="formValidate.number" placeholder="输入合同编号" :disabled="!isChange"></Input>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="输入被保人姓名" :disabled="!isChange"></Input>
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input v-model="formValidate.phone" placeholder="输入被保人电话" :disabled="!isChange"></Input>
        </FormItem>
        <!-- <FormItem label="地址" prop="address">
                <Input v-model="formValidate.address" placeholder="输入被保人地址" :disabled="!isChange"></Input>
            </FormItem> -->
        <FormItem label="保险类型" prop="insuranceType">
          <Select v-model="formValidate.insuranceType" placeholder="选择保险类型">
            <Option v-for="item in insuranceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="合同日期">
          <Row>
            <Col span="2">
            <FormItem prop="date">
              <DatePicker type="date" placeholder="选择日期" v-model="formValidate.date"></DatePicker>
            </FormItem>
            </Col>
            <Col span="2" style="text-align: center">结束日期</Col>
            <Col span="2">
            <FormItem prop="stopDate">
              <DatePicker type="date" placeholder="选择日期" v-model="formValidate.stopDate"></DatePicker>
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
        <FormItem label="实际支付" prop="payment">
          <Input v-model="formValidate.payment" placeholder="输入实际支付金额（元）" :disabled="!isChange"></Input>
        </FormItem>
        <!-- <FormItem label="邮箱" prop="mail">
                <Input v-model="formValidate.mail" placeholder="输入电子邮箱"></Input>
                </FormItem>-->
        <FormItem label="合同文件" prop="desc">
          <div class="com-upload-img">
            <div class="img_group">
              <div class="img_box" v-if="allowAddImg">
                <input type="file" accept="image/*" multiple="multiple" @change="changeImg2($event)">
                <div class="filter"></div>
              </div>
              <div class="demo-upload-list" v-for="(item,index) in imgArr2" :key='index'>
                <img :src="item" alt="">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(index)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="deleteImg(index)"></Icon>
                </div>
              </div>
            </div>
            <Modal title="合同文件预览" v-model="visible" width='60%' :styles="{top: '20px'}">
              <Carousel v-model="value1" loop>
                <CarouselItem v-for='(img,index) in imgArr2' :key='index'>
                  <div class="demo-carousel">
                    <img :src="img" style="width: 100%" alt="">
                  </div>
                </CarouselItem>
              </Carousel>
            </Modal>
          </div>
        </FormItem>
        <FormItem label="备注" prop="desc">
          <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入备注..."></Input>
        </FormItem>
      </Form>
    </Modal>
  </Form>
</template>
<script>
  import axios from '@/libs/api.request'
  export default {
    data() {
      return {
        value1: 0,
        visible: false,
        uploadList: [],
        imgData: '',
        imgArr2: [],
        imgArr: [],
        imgSrc: '',
        allowAddImg: true,
        allowAddImg2: true,
        showAddModal: false,
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
        total: 10,
        pageSize: 10,
        pageNo: 1,
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
        formValidate: {},
        ruleValidate: {
          name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
          address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
          contactperson: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
          num: [{ required: true, message: '合同编号不能为空', trigger: 'blur' }],
          unitPrice: [{ required: true, message: '成本单价不能为空', trigger: 'blur' }],
          duration: [{ required: true, message: '购买时长不能为空', trigger: 'blur' }],
          payment: [{ required: true, message: '实际支付不能为空', trigger: 'blur' }],
          tel: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
          insuranceType: [{ required: true, message: '请选择保险类型', trigger: 'change' }],
          date: [{ required: true, type: 'date', message: '请选择日期', trigger: 'change' }]
        },
        getValue: ''
      }
    },
    created() {
      console.log('创建完成')
      console.log('接收的参数', this.$route.query.value)
      this.getValue = this.$route.query.value
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
        that.imgArr = res.data.data
      }).catch(function (error) {
        console.log(error)
      })
      axios.request({
        method: 'post',
        url: '/main/instype'
      }).then(function (res) {
        console.log('请求保险类型返回值', res)
        that.insuranceList = []
        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].fields.iscompany === true) {
            that.insuranceList.push(res.data.data[i].fields)
            that.insuranceList[i].label = res.data.data[i].fields.name
            that.insuranceList[i].value = res.data.data[i].pk
          }
        }
        console.log('处理后的保险类型返回值', that.insuranceList)
      }).catch(function (error) {
        console.log(error)
      })
    },
    methods: {
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
        axios.request({
          method: 'post',
          url: '/main/updataimg',
          data: {
            companyid: that.formValidate2.id,
            contractimg: that.imgArr
          }
        }).then(function (res) {
          console.log('上传图片', res)
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
        console.log(this.formValidate)
        this.$Message.success('点击确定!')
      },
      changeImg: function (e) {
        var _this = this
        var imgLimit = 1024
        var files = e.target.files
        var image = new Image()
        if (files.length > 0) {
          var dd = 0
          var timer = setInterval(function () {
            if (
              files.item(dd).type !== 'image/png' &&
              files.item(dd).type !== 'image/jpeg' &&
              files.item(dd).type !== 'image/jpg'
            ) {
              return false
            }

            if (files.item(dd).size > imgLimit * 102400) {
              // to do sth
            } else {
              image.src = window.URL.createObjectURL(files.item(dd))
              image.onload = function () {
                // 默认按比例压缩
                var w = image.width
                var h = image.height
                // var scale = w / h
                // w = 200
                // h = w / scale
                // 默认图片质量为0.7，quality值越小，所绘制出的图像越模糊
                var quality = 1
                // 生成canvas
                var canvas = document.createElement('canvas')
                var ctx = canvas.getContext('2d')
                // 创建属性节点
                var anw = document.createAttribute('width')
                anw.nodeValue = w
                var anh = document.createAttribute('height')
                anh.nodeValue = h
                canvas.setAttributeNode(anw)
                canvas.setAttributeNode(anh)
                ctx.drawImage(image, 0, 0, w, h)
                var ext = image.src
                  .substring(image.src.lastIndexOf('.') + 1)
                  .toLowerCase() // 图片格式
                var base64 = canvas.toDataURL('image/' + ext, quality)
                // 回调函数返回base64的值
                if (_this.imgArr.length <= 8) {
                  _this.imgArr.unshift('')
                  _this.imgArr.splice(0, 1, base64) // 替换数组数据的方法，此处不能使用：this.imgArr[index] = url;
                  if (_this.imgArr.length >= 9) {
                    _this.allowAddImg = false
                  }
                }
              }
            }

            if (dd < files.length - 1) {
              dd++
            } else {
              clearInterval(timer)
            }
          }, 1000)
        }
      },
      changeImg2: function (e) {
        var _this = this
        var imgLimit = 1024
        var files = e.target.files
        var image = new Image()
        if (files.length > 0) {
          var dd = 0
          var timer = setInterval(function () {
            if (
              files.item(dd).type !== 'image/png' &&
              files.item(dd).type !== 'image/jpeg' &&
              files.item(dd).type !== 'image/jpg'
            ) {
              return false
            }

            if (files.item(dd).size > imgLimit * 102400) {
              // to do sth
            } else {
              image.src = window.URL.createObjectURL(files.item(dd))
              image.onload = function () {
                // 默认按比例压缩
                var w = image.width
                var h = image.height
                // var scale = w / h
                // w = 200
                // h = w / scale
                // 默认图片质量为0.7，quality值越小，所绘制出的图像越模糊
                var quality = 1
                // 生成canvas
                var canvas = document.createElement('canvas')
                var ctx = canvas.getContext('2d')
                // 创建属性节点
                var anw = document.createAttribute('width')
                anw.nodeValue = w
                var anh = document.createAttribute('height')
                anh.nodeValue = h
                canvas.setAttributeNode(anw)
                canvas.setAttributeNode(anh)
                ctx.drawImage(image, 0, 0, w, h)
                var ext = image.src
                  .substring(image.src.lastIndexOf('.') + 1)
                  .toLowerCase() // 图片格式
                var base64 = canvas.toDataURL('image/' + ext, quality)
                // 回调函数返回base64的值
                if (_this.imgArr2.length <= 8) {
                  _this.imgArr2.unshift('')
                  _this.imgArr2.splice(0, 1, base64) // 替换数组数据的方法，此处不能使用：this.imgArr[index] = url;
                  if (_this.imgArr2.length >= 9) {
                    _this.allowAddImg2 = false
                  }
                }
              }
            }

            if (dd < files.length - 1) {
              dd++
            } else {
              clearInterval(timer)
            }
          }, 1000)
        }
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
      }
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