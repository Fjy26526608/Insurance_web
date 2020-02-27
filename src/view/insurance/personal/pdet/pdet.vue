<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    <Row>
      <Col span="18">
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
      <Col span="6">合同照片</Col>
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
    }
  }
}
</script>
