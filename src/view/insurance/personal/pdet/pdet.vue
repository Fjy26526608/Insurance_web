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
          <Col span="3">
          <FormItem prop="date">
            <DatePicker type="date" placeholder="选择日期" v-model="formValidate.date"></DatePicker>
          </FormItem>
          </Col>
          <!-- <Col span="2" style="text-align: center">结束日期</Col>
                    <Col span="3">
                    <FormItem prop="stopDate">
                        <DatePicker type="date" placeholder="选择日期" v-model="formValidate.stopDate"></DatePicker>
                    </FormItem>
                    </Col> -->
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
      <FormItem label="备注" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入备注..." :disabled="!isChange"></Input>
      </FormItem>
      </Col>
      <Col span="1" style='text-align:center'>合同照片</Col>
      <Col span="5">
      <div class="com-upload-img">
        <div class="img_group">
          <div class="img_box" v-if="allowAddImg">
            <!-- <input type="file" accept="image/*" multiple="multiple" @change="changeImg($event)"> -->
            <div class="filter"></div>
          </div>
          <div class="demo-upload-list" v-for="(item,index) in imgArr" :key='index'>
            <img :src="item"  alt="">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(index)"></Icon>
              <!-- <Icon type="ios-trash-outline" @click.native="deleteImg(index)"></Icon> -->
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
              <CarouselItem v-for='(img,index) in imgArr'  :key='index'>
                <div class="demo-carousel">
                  <img :src="img" style="width: 100%"  alt="">
                </div>
              </CarouselItem>
            </Carousel>
          </Modal>
      </div>
      </Col>
    </Row>
    <FormItem>
      <Button size="large" icon="md-checkmark" type="success" @click="handleSubmit('formValidate')" v-if="isChange">递 交</Button>
      <!-- <Button @click="handleReset('formValidate')" style="margin-left: 8px" v-if="isChange">重 置</Button> -->
      <Button icon="md-create" size="large" type="primary" @click="doChange('formValidate')" style="margin-left: 8px" v-if="isChange">修 改</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  data() {
    return {
      value1: 0,
      visible: false,
      uploadList: [],
      imgData: '',
      imgArr: [],
      imgSrc: '',
      allowAddImg: true,
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
        unitPrice: '', // 单价
        duration: '', // 购买时长
        payment: '', // 实际支付
        phone: '', // 电话
        mail: '', // 邮箱
        insuranceType: '', // 保险类型
        gender: '', // 性别
        date: '', // 日期
        time: '',
        desc: '' // 备注
      },
      ruleValidate: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        // address: [
        //     { required: true, message: "地址不能为空", trigger: "blur" }
        // ],
        manager: [
          {
            required: true,
            message: '联系人不能为空',
            trigger: 'blur'
          }
        ],
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
            required: true,
            message: '请选择保险类型',
            trigger: 'change'
          }
        ],
        // mail: [
        //     { required: true, message: '邮箱不能为空', trigger: 'blur' },
        //     { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        // ],
        // gender: [
        //     { required: true, message: '请选择性别', trigger: 'change' }
        // ],
        date: [
          {
            required: true,
            type: 'date',
            message: '请选择日期',
            trigger: 'change'
          }
        ]
        // desc: [
        //   {
        //     required: true,
        //     message: "请输入备注",
        //     trigger: "blur"
        //   },
        //   {
        //     type: "string",
        //     min: 20,
        //     message: "最少10个字",
        //     trigger: "blur"
        //   }
        // ]
      }
    }
  },
  created() {
    console.log('接收的参数', this.$route.query.id)
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success('成功!')
        } else {
          this.$Message.error('数据填写不正确!')
        }
      })
    },
    doNew() {
      this.$Message.success('点击新增!')
    },
    changeImg: function(e) {
      var _this = this
      var imgLimit = 1024
      var files = e.target.files
      var image = new Image()
      if (files.length > 0) {
        var dd = 0
        var timer = setInterval(function() {
          if (
            files.item(dd).type !== 'image/png' && files.item(dd).type !== 'image/jpeg' && files.item(dd).type !== 'image/jpg') {
            return false
          }

          if (files.item(dd).size > imgLimit * 102400) {
            // to do sth
          } else {
            image.src = window.URL.createObjectURL(files.item(dd))
            image.onload = function() {
              // 默认按比例压缩
              var w = image.width
              var h = image.height
              // scale = w / h
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
    deleteImg: function(index) {
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
