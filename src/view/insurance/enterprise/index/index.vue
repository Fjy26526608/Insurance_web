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
        <Button type="primary" @click="showAddModal = true" class="mr15">新增</Button>
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
      <Table size="large" :loading="loading" border stripe highlight-row :columns="columns" :data="tableLisr"
        @on-row-dblclick="cdet">
      </Table>
    </div>
    <div class="text-right pageList">
      <Page :total="total" @on-change="changePage" :current.sync="pageNo" :page-size="pageSize" show-total
        show-elevator />
    </div>
    <Modal v-model="showAddModal" title="添加保险合同" @on-ok="ok" @on-cancel="cancel" :closable="false"
      :mask-closable="false" width="60%" ok-text='添加' :styles="{top: '20px'}">
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
          <!-- <Row>
                        <Col span="3"> -->
          <FormItem prop="date">
            <DatePicker type="date" placeholder="选择日期" v-model="formValidate.date"></DatePicker>
          </FormItem>
          <!-- </Col>
                        <Col span="2" style="text-align: center">结束日期</Col>
                    <Col span="3">
                    <FormItem prop="stopDate">
                        <DatePicker type="date" placeholder="选择日期" v-model="formValidate.stopDate"></DatePicker>
                    </FormItem>
                    </Col>
                    </Row> -->
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
                <input type="file" accept="image/*" multiple="multiple" @change="changeImg($event)">
                <div class="filter"></div>
              </div>
              <div class="demo-upload-list" v-for="(item,index) in imgArr" :key='index'>
                <img :src="item" alt="">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(index)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="deleteImg(index)"></Icon>
                </div>
              </div>
            </div>
            <Modal title="合同文件预览" v-model="visible" width='60%' :styles="{top: '20px'}">
              <Carousel v-model="value1" loop>
                <CarouselItem v-for='(img,index) in imgArr' :key='index'>
                  <div class="demo-carousel">
                    <img :src="img" style="width: 100%" alt="">
                  </div>
                </CarouselItem>
              </Carousel>
            </Modal>
          </div>
        </FormItem>
        <FormItem label="备注" prop="desc">
          <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入备注..."
            :disabled="!isChange"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { getToken } from '@/libs/util'
import axios from '@/libs/api.request'
export default {
  name: 'enterprise',
  data() {
    return {
      imgData: '',
      imgArr: [],
      imgSrc: '',
      allowAddImg: true,
      showAddModal: false,
      total: 10, // 一共有多少行
      pageSize: 10, // 每页显示行数
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
          tooltip: true
        },
        {
          title: '公司规模',
          key: 'psize',
          align: 'center',
          tooltip: true
        },
        {
          title: '地址',
          key: 'addrss',
          align: 'center',
          tooltip: true
        },
        {
          title: '合同起始时间',
          key: 'stime',
          align: 'center',
          tooltip: true
        },
        {
          title: '合同结束时间',
          key: 'etime',
          align: 'center',
          tooltip: true
        },
        {
          title: '负责人名字',
          key: 'contactperson',
          align: 'center',
          tooltip: true
        },
        {
          title: '电话',
          key: 'tel',
          align: 'center',
          tooltip: true
        },
        {
          title: '备注',
          key: 'remark',
          align: 'center',
          tooltip: true
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
  created() {
    console.log('完成创建')
    this.loading = true
    this.tableLisr = []
    let that = this
    axios.request({
      method: 'post',
      url: '/main/companylist',
      headers: {
        token: getToken(),
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        page: 1,
        pagesize: 15
      }
    }).then(function (res) {
      for (let i = 0; i < res.data.data.length; i++) {
        that.tableLisr.push(res.data.data[i].fields)
        that.tableLisr[i].id = res.data.data[i].pk
      }
    }).catch(function (error) {
      console.log(error)
    })
    console.log(this.tableLisr)
    this.loading = false
  },
  methods: {
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
    deleteImg: function (index) {
      this.imgArr.splice(index, 1)
      if (this.imgArr.length < 9) {
        this.allowAddImg = true
      }
    },
    changePage(page) {
      // alert(page)

    },
    cancel() {
      let url = '47.105.49.81:2222/main/login'
      let data = {
        userName: 'superadmin',
        password: '1'
      }
      axios
        .post(url, data)
        .then(res => {
          console.log(res) // 返回的数据
        })
        .catch(err => {
          console.log(err) // 错误信息
        })
      this.$Message.success('点击取消!')
    },
    cdet(e, index) {
      console.log('我的下标是', index, e)
      this.$router.push({ path: '/insurance/enterprise/cdet' })
    },
    ok() {
      console.log(this.formValidate)
      this.$Message.success('点击确定!')
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
