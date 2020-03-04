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
          <Modal title="合同文件预览" v-model="visible" width='75%' :styles="{top: '20px'}">
            <Carousel v-if="visible" v-model="value1" loop>
              <CarouselItem v-for='(img, index) in imgArr' :key='index'>
                <div class="demo-carousel">
                  <img :src="img" style="width:600px" alt="">
                </div>
              </CarouselItem>
            </Carousel>
          </Modal>
        </div>
      </Col>
    </Row>
    <FormItem>
      <Button size="large" icon="md-checkmark" type="success" @click="handleSubmit('formValidate')" v-if="isChange">递 交</Button>
      <Button icon="md-create" size="large" type="primary" @click="doChange()" style="margin-left: 8px" v-if="!isChange">修 改</Button>
    </FormItem>
  </Form>
</template>
<script>
// import { getToken } from '@/libs/util'
// import axios from 'axios'
import { getInsuranceTypes, getInsuranceInfo, saveOrModifyInsuranceInfo } from '@/api/insurance'
import { formatDate } from '@/libs/util'

export default {
  data() {
    return {
      id: '',
      value1: 0,
      visible: false,
      uploadList: [],
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
  created() {
    this.id = this.$route.query.id
    // 查询保险类型
    this.getInsuranceTypes()
    // 查询保险详情
    this.getInsuranceInfo()

    this.imgArr = [
      'data:image/png;base64,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',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAACCCAYAAADmIBXRAAAgAElEQVR4nOydB3xUZfb+v5ma3nuHkBBCIHRBBBRUFBQEsXd0WQt2ZddV7GXtXeyyFuyCSBGQ3ovUAKGmkZBeJ9PL/9yZQAIkAV1d/r/deT6blZl7571vOe9znvPee8/r4xLghRdeeHEaoDrdFfDCCy/+d+ElIC+88OK0wUtAXnjhxWmDl4C88MKL0waN8n+Nh+DzL6H7WBia4TngsMKs9+S/vWHsmaAXqnKZ4acvwNwVhgfD9DUwbgKkRf7GqzZ4rpcyHIak/8EtagfmfHjpU7DYPZ99wmDiTZAa9m8W7ILdK2FeEdx8KQSo7azdXcGiUisOvY5LekbRP1KLj5zqcLrYt7+CHwpNWJw+9Okaw9hUX6mchW+2VrKjzt6qXBdmu5oL+sUwLE6Py9p+uQocNjtb9lfzY4EJl6+e8TlR9AmX4XU5KSipZ2ZuPdVy/ZTkSK7IDCJY4/mdwWjkpw3V7DI7CAryY0KvGDoHNJfpsLF+RxWLyywoNRuak8CIOG2H9T0vJwbXKj21CXDJEPA9BRcnVcTUBBt+Bmum2FaPZsNsBafY4wKxvTyxu79cBIH6tstq6zyXA0q2iM0tgCY5ntIHrhVb922rLtKk+sMw80c461pID205VrUffpgNxTUQkQ03jIEw/5O3z4v24TaPABmkrUtg9joZwOYDplL45EV49Rswmj3fNRbDpzKJCy0ySJWwaRvUmn7HVY1iJDKQm0v/mEacCgxCEJ8uhMyzxXBugLiDMPVJKLX9e+WaxVjf/QD8oyFYZ+PTBfv4cJ+Nkb2iGRZo5emZBWyskxkgTLVyYwGPrWgkOzOKsZ19+XpFEV8WmHHqdAzrFskNQjZH/s6LdLGp2IhKrUbj6KhcD/l8u7SQr4uV4zFckaKjrNaMSQ431Dax7rCDEVLmFRmBbNxwkDe2NOButs3CitxGEruEc21OJLqKCu6eU0KJRVjV6WTXvnrKdf5MUEgwAl6Yl8/CMhtOffv11ejVJIfLBH4bcg+fQgcKIWz5BV58Gh54ANbuabHB1igUZ/f0w/DVYoXI2y+urfMOioN49HVIFEc6YTSsfhfe/EkufVw5DeUw9yu45z545iWxjVb8Wr4TpvxFCEyI9eorpOyNcp3p4tA6qIsXJ4ebgFRRMFiUyNZl0tFWz4GDq6FCOtu+TwaimWRKZdKKM2SAeKm0s0UBvQb9kpo9mJwj8wCTkIs4VayOYy+kKCpj8zF7G4PW+riluQ6K51LKczY/KOA87rNDrmc8cq695fftGahKDfEp0KWLGKKolb3StrLqluNWc6syWtXrSH2O1tXuIWWlGnli6IUhMP4cKb/JzLJSI+mibM6K82dk90hSVE0sPWTDLC7+6/U19Owfw6ikAPqIbJyU5sPnm2pQhERMiC9dIv3cf539fViZ30TPrBgGRIsW6KBcpRYH8yuZU6HmL8MS5LgfPTpHMCotED9pb3B4EFf2j6SnlNujSwSXxGtZu1fUkNIQrZ5RA2IYkhhA17hAt2oyF9WyXxkglYoemZGMywqhm/z2zB6x9DQZWFdhxu7j0259z4jR0G2E9EcWfLtI+q5d0/PAVA8HxJldeZvYVWzb5xjL4P33RbXK2AW0+t7capzaO88p47Tga1FCosYuOxty+ooDEvXztZDQYYOMual5fKXJjRVSXjz8/Vaxk+Pk0S/iZA6nCfmMh26i0Cb+FXbOgnWFJ2mgFx3iqEDuJxOoQRROkRiDMqq/irrpO0oGTIx4S7Hnu0MHhGRkELpJ2FKzCW68F3ZVycDLINx3s3gZUUzPive5+Tq4faqUVe8p2ywh14x/yvmT4O4H4QMZuEZzSyWaRNJ+Jh7wL3fAHfJ3z/1yffFGNXvl3zfC99s85+1dCteIB/tpt+fzdlFRt/xdSEQM56dpYhRiOPf9Tbzv6ra96FHIvN2wHSKFYCOCPF8Vikd7Ttoz6Q5P/Z96UwxOwoI88ZTX3S3/rWn5+ebvpa73eqT4omXQexhESWSCr5acEC3VdSaM0l9NRhvVKl+6RmiEdG2UWbUkB2tRu3teRXykP4aKJqodrR/FcrHrYCXrjf7c1DfEM5E6KNdhc7Akt4qI1ABMZY2szm9gS5kZSxtPd5nNVvLqnCTG+BF0wlEnhZVmAmMCiNf4HHfMRXVVEzUaLZ2CtMeFR23UV/piiNhTrpDzIUNHAwF+4vwuuwaS2wuFpb0LJaSqFFK549KWsEmxmfuE6KYtcIuods+zCgPuKIBscbBapVnS+UndhKBEEQtnMkPs8Q6xoSqZCQlCLGOHS/jXRthYJXYe2lnsRev57CuKN1n6eE/xsSToxW/DUVtK7CcdLBM5twBkHFgrk/xMIROLdPwGiZ+vFtWzdwecIZMtxM9DIAeFeMx2j1IpEOlsESP68gUZHCnnbglzpovknXqheI/p8I2ojWdEBncPhDWfCQk1y3OZl/wgSmreIXhevFKiMMcXQl5TxTDeFUKLFqNZJuRwmcTc+6QeO2XAV+XCGDGovUIiukghCiHDF2fCyzOEDKQO+Xs9RnG8HRkPe1TbEgk5F8k59z0KKTJj6qUdzzwkhCSG+554YnsJPD4R3pFQ4s4zxPiEPH+WOnQZKd5VjHaphKup4lHDhWC3SpnXDGi+ls6XMX1jeFTCoXtq6tzWH5cayYWiCpwWPQkSou2ssmBJ9ZUJIpO60UqjzUUrpY/DYmHujjp6dE+WvmpuQQfl2kW2HRB1tKm2irD6AAL8fNiRX0t2/85Mls72V7nYsb+Sbw4YqTPZ0AeFctegiKMKwVxTz1tb6qiSY2V1Lm4+O5E0ffN1j6712DhYZaVXTjwXJfke069t1lcQqExWsZ1ykVoixn4XFGWdKwTzjYRVNz8rfbykleHq4PyrRDmmyr/lvB3tnGerFbsRpzoipMUeAoR9/cQGKqQre14g9ioD4HeSuiSL4527X9ojhJYgvzWLjZc3KOtkv69tXnhw1GJ8Q+Es6eRfZVIfypc/GZG+Msl7CxsdXC/eXibbNvEavTKbPclx0ItFj7hIDEL+G5IqAyuhWZ6QmFE84AKJ8c+/VrxQhDggGbzBoqy6Jnl+ZxIjnbcKxok66iTHtHLdC66Wgc2T68kAjxgkEl2uXyjlbBGSu0gMZvcyKBHpvLNAypLjigs0SZ3z5DeKsMro4XbCJ0DxWuePEwkuJHOneM+ZQojrhfj2Sfl7hbgmXe2R7iGijMYKca6aI6pQvr9qsJDWcmmLGF+N1GG9ENRIIdcmMWCDTK7E5oVKm8XErM11dE6P467BMVybGUTt3nK+zjej0+u5YmAYuVvKmbO3joW7yvh0U50oGZ9j6nroYAVz6zWM7BRwtJ87Ktcu7G8QuRMfF85t5yfzwDkJ3N4zkNnLStiryCUJlzKkgso6zfXdZBbW1zJtU7VbSSnQBQVwSU401/eJoUeQnTdWH2ZPfbN+PLrWE8sVXXxZv7+CHwvMtBZsbdVXgVaZ5P4ySWtP1RRPhOJYnv8chv1FFFXnY4/ppd8vuQsGdRUF3MF5StjeXhiolY7vIzZ75SXHhnZtYfAECJMQ75PpsFIU9scS6u0U29WJompjOnhxijhKQOJkOeMsmeQymLsl5PGXWDhFBrmLxMxWUR27pNP3y2B2S2373r0yCIH+LR/UTg+5NIrCOSQDFxvV8juZE2iatZddiK1eDDo2oqWsQDFemRdudZXeX/4rCmXnZigV2T36CjE+IY08Icoi8ULZQpqd5ZyBIr0fEAK5RYxy9qZ2GttqDWi8KLRQIa3lUm6tlOsrSipM13JuVJzUU5EmQoojJO5vEu+6W9TOClFaUQOFnBVDl3q7fI7ISBcHC2qZW6PiukFRZEt4NbRHLKOFzL7YUEmFU82QASk8eVYYxWUGCYXg7N5RnBXvR6TaY8Ium5WfcuuJjo+gb+QRcXqSch0agnx1dE/wI0yr9K2K1JhgAm1N7GvyMIXeT+deq+mfGc3dOcGszK1ga52HZFRajftYVnwQdw2JJ1w64/si69GBOrLWc1HfBMYGW/lU1I7B7uqgvq1sQNvxgnFHcBjhO5nk62XsC1dKSPy4qFdxCPtlbN/8SJxi9amdVyhjGG3zKPYjVTE3r0NGhLZz8TYQLU7tLQnL40QBbxSHlSSh2hhRwdJ077Ms/wZarEaMJaOPGOuPIjVlsHqN9chUe7IoEyGejz4VkkqVyR7/2y8S6PCQhWK3yvKCOGHq6zzH1KIwQuT4QSGpYUIMIgioFeNqlFFNlMENF9XSQ1TRTzLxm3qKspK/7uLIv5d4v7GTpz4h0opnvoaLfxYjkRDwBVFLPd6Tencg/ZXJERTomSDhsaJufoJKoye8VFAoIVqAXD9ESDVC+mWYTPgfvhOPXiCe9+8ej+kj9fAXlVYhv8sKcWG22rA6fVp5U5V4SB9sNkfz3RI1fbKi6KP80+nkp1X55Egj/ZulQ32VgSWlNoaNCmlVRsflOn3UpMdqWFtjQz66PbJV4gKHeJTEgBN9s95PQ7h0sosTF4lUejURQkiqto6pVYQHaAlt8jiQ9uvrgUPOs8k4RAS3PwYdQSUO8erHYNQR+SJtWyVtKxKnMUrUa2zQqZ2XJI4lR5xUnrJ+OdDzOElZgXS/KPkuv/EWepSUc/N9nn+XiENaKXXomvz72ueFB8eQd2IXj7f4eZ9MqHQPO+lkkHqLt18srJ8qAxhz/AMaJ4GfDNIlEvYsfctzW7ZBiOcXmez7mteA/MQLTTgffnwRtjcfn/eDqK9zhQQjPFL7jG5CikIu8eKFwoUgemdISLRI6jLAU58SUUSVjSK/L4MpooACZLI72tDF7rt1zXe5Nkod9oijH5ANmRJiDRb184GQWrkcK8oVFSWKb7iorSjpIZXUYYxI9dn/kvpJXwzv4inPX+qXKDNv+25PV6bGBZOjNvF5XiN1VgdFh2uZLWFSny7hJGhdbC+qY0OlFaPVzoYdZSwsdzGiWxA6d11dFNcYKLP5c1ZC607uuNxkfzUjekZiKKhg5WErDSYz87fX0ikzkl4BaoqLqllabJJrOqmrbeJfW2tJTo0gK1RNY10Tc0SKVUg81iRyc9mOSor8grkwVS+hi5N1e6rIrbW7f1tYUMWsEicXZoq6ci9St1dfDxTVWiVjFR1xwqFTggg5IpM8avXIX0qcx57SUsVfylj+60lYtFOUbAfnhYl9XSDh087vPQq2XhzhwmVw3qViO1K/ldPhQwnfGk9SH7PY2E8bPLZTvAve/VDKl3I7n7ia78VvwDGWoxU1cbFIS52EJJmJnrBKLROz39kShkgYdtGgVifLpMzpLpNQlIRavFAPCdUSQloOx8uxLPE+OlFRYx8UVfMwvCJ/fjJhz5PyJoz3nK9uPu54FV57FHdYk5oDj92E+zayQpF9hsmk3yNEJiGiSurT5zz5LJN+9EDPtWKkjDc+gB1FQlgx8lspJ/V4lyz1zZDrTX8evpUyNFK3Ke9AfyEUnVzjXlFO78jfA3dIu6U9590Nl57T8vM0aXuC1O28Ia0egpPyhgsJfrYUbpA2hYimf3S8ig+Wl3F3njRFZNa5Z6cxKj3YvT6Sonfx2tpCphmdJMSGcds5KWQEqz1lOV2iEFWc1TOcLrpjRf3Jyk1Ni+MxCTWeW1XAV8rnmHAeGxSJnxQTGurH7rUlfLraIQTsQ3Z6HE9nhxMml3UG+xG0v5on5pbTZJdwK8yfR0fF0jtIpTxXSLzOyQfLDnBI1IVWpeG8oZ25KMnP47U6qK+iQtYsF2chUi85hFNGZ1G34WHthzQhMrY5Jhk7qbtFlGeeOEXH4I7PU+569RXHdJeosTee8IThfUfCtaPlkPRVmSilna7mO2nN8JU69xXbCmm1OKcRoilfBXdME5uXuXHJreLwBpx627xoGz7edBynAOmhbd8KsX0joZ4QXfdWt4zr98OkR2CieOMhqd6n0hSYDqr4x3PiWMThjMo43bXx4v9neAnoJLBWw5btEhb+KMpiFFx3/rGyUXkActmnEg6U2vFJK2xeuf7fRZBLS8/8ZGpTNdxxpagF7wqtFx3AS0AnQaWEfl/+DJ1Ebo8a6JHtXnjhxR8DLwF54YUXpw1egeyFF16cNngJyAsvvDht8BKQF154cdrgJSAvvPDitMFLQF544cVpg5eAvPDCi9OGP42AHFYj1t/7KrQX/5twObC0kS7TYbOKLf1xT4s4bBbMtlbXcTmxGI9NM/LnwoXdYsR+3AWdDnubdbBZrf/Buv12uBy2Y/vzN+A3vlp6qrCx5IOpbEu8kks7qymtN57wfnVYcncyE8NQq5TsdsXs2lXYbt6WoPBOZGUltJnj53goTzUpyd/NNhcGswOjxen+t01GUPne/X6bkoNH44O/TkWAr/zpVejks0q+/+99ztDJwRIjmjA/Ev3VbXseh4OdZUb8gv3pHKT+T1cQR9k23vlxN+OuuIzUo7lRbOyc/w6f5yXxyF3jCG6V5b6mOI9dhVWnVnhYMgMyE9FhZdeCj3h7uYH7HrybjGhfMBbw/iMfk3bDRLpESNvjY9AcfeLUQN76XKps7T3hHkb2gExCdcf3l5WD27dQ2tA66bie5O5ZiNmz+P1HyIsfz5hB2STHKvPAQcHaxSw9pGbChHMI0TSXZ2vi53fepLDbGCaNzEJ3/FWq89myt9Rt3+GdsslKaMkx4jA3yLzaRb1RybgWS++cTgRojq/nydrXgviuvekcdWLmpIMrP+WjXf787abLCfH7bXbzpxCQs24fS9eZ6HuXmo+mPkZp+gB6xB/JjeGkeMsiGtJu4bWHJhCos7Jnycc89s5u+gztgd9xLGMu3MoW63A+nH4b7aQMPgqFYGqbHBRWSpmlFvJKzeRXWCirs9FgEu8qRKSkkvAXwgkL0JAQrqVLjJ7MBF+6xOpJjNASqFe3pJuoMfDltkaGD4wm4zd27BEc2FfOyiY9l/YKbSMN6n8ODVW1PPpDCRdelMHVndppi6GJp3/aR3L/TJ7ve7IUXW1DeYt+4abD+CRHMjxO36HTOL5/nf4x+BW+wldre3D/8C64narTTkhsApXfbia/aijp4Z56acRz1ZXsYePGg8eUaTXs5csPV9J1zCUM6BzRkgWxkwOf/QuYv7FQCKeSzYuXcm91LX1TAhh87jBqyyupbSjmp69mEjHoaq4aO0BJBYWh6ldenPww+hEXknD8ADaWMH+xhWfmv86wyGNzv5jqD/DJs3+jpvNIynYtITCpF7riMjKuvZe7J2RgrD1MkWET01Z+ychJTzMiK5SITkHsnfY2X0bEcut52Z6CxKNa6iupbp3D2HOAst0rePuFaRyOySYjsomNHyzizofv5KyMSHce5DnvP83MfS4yU6XcVbvJue4ebh1/Bq03FLEYatizYQMH7W2ndrQ11bFq7ucsO2jlH9NX8/cLj7ULc+02Pp3+M6pz75a5o3IrOx+tv1tYnAr+BAJysHf9coxd+jKkcyA7/eO5eOJdjOt25LVoK5u/M/DFzmN/ZaipoDB//wn5eJ1VVRgDT+39KkXpbDxg5Oet9ewrs9LgzggIUcEaOgvRKKrHx32ek9JaOzuKTeSVmFm3v4leKf6M6RdCdpIvah9Puomq6ka+WldFtwEyQX5nX2zdXcVX9cFccFoJyMXarWLEYcGcKaTwZ6o8q9XM/LVlhPsFcU5cO3vnNNfp+P7VhiQw/poreHTap3xaEMumzTsxuzcUcVBXU88/p045muu5/7jbuWnUWO4d2KpIh5mlHzxP0ZX3MuWx60jxb6UXZCI31XQmNtvz3vtNd0zxfC9jHeRvZb380z+qJ9fdomfG7PXsL+9J9xjP1cwNVVQW7Md0fN5WS73YWPtJp7T2OhrMEWT1ShO1VidiKaRV6lcVIRnncvmgWH7ed4jBWeGEJAzktlv28sDXMxja+ymyIjtwejYj6+Z8zCr9QD5/5C7itbVM/8fNvP31CnpPGUfNivf5YGUND730BoNTfCno8w6XP/022T0yGZ4ectQG9IHJjL3zrjYv0VC2k4+efphSezeeeON+rj3n2ORHisL64Z13KI8+n0cmyEBYK/jipcewDfkHtww7tURJfzgBOc31rFy5kaQ+dxLuzi3swGxsoqnpyKUkXrSeSCi9R93Ew1PGE3Ccy6xeNZ27vzm1aioEtFNI5deDRuqEfJRQK12UzXk9g93E4qv1sJtBwrLVewws3tHoVkeKalLUUa9UP7qJGlLYu7q0lg+2VJNvNPPJ0iJ2JkdwfVYQGvEUy3YcZmWVA52fnvG9oukRqsYubVq9q5yFh21iZ/5c3iuSwwfL+EwIcbfVwQsLnIzsHsvIxJZJ6RTFVlJczWd7DTQ5fOjeJYqru/iLknOyd1+le/8whUPjI4K5qn844WI1lYeqmFHkoGeIinUlBhpkPg3vnUCyqY4fpN0GacfwPome/buO9EuDgR/zTeT0TaKTrw8OadO325Rczw7lXRzO6X3s+VaDiRlra9hZZ5fjeq4cGk12oGcMbBY7a3Z72omvjvE50fQN1xz93RcbSllZbSF4SxmaBhPnRatZUGJhdK8Y+oRpMJTX8vpeC2dGqFiQe2z/XpWmwTdhELdeHURcr8FcP0nJnNmy95nLKd74q18IG3oB2YnHT3wnBZtm8dZ788h+cvqx5KNAiEbjMLFo1pcU13hISFm7COnei4j9m1m8fTPbXn+KdRKiKk5w8459dA7v4T4vOmMAtz37Fr1jjrtkxTbuvPf7du3RN6azOLZoquothKSMoGtgEfm7FvL809+xdfF2ynPfwyJkENFJRUV1FyJ8JYzqdQlPBGwnwk+Rfx4CcrmctPXClL9U1F+vd6dd8VHrCIuOI0DsRa22sG3tRjSxF5CV4sm6FpUzmG5Vn7NpTzFD5ZodKVOX00He0g959a2vKA7ox9/evY/L+sYde5KEhutmvc2c0mT+/uREEvVOts3+ivfXN/HX4R0Ufhz+YAKS8GftN3zy4y6uGxHkNhxj3X4+fGYKC48mV3FRf3gngYNyjvnl5nmfcH/JkjYUUAH1geNPuQaeNSB3wkECfVX07RxAzxQ/txrKr7Ci1/qQGqVncEagO1SrbLC7z1f+Wg9ycGQQI1ICWbLXwfk9oxgS5otePOzLs4poiA3l2j6BrNtSzKTZZj67NImD6/OZXq1l8hCx0gYzDQYb3TuFMTy2mkZLEFf0i6FTQOtJ4WLbjmJe+NXExUMTOSMYioVNCsTNFmwrYFquk+suiKOTEPa/FhYz1eDk6aERVJXX8/SCCm4ckc6NQnK/LD7IxOk1jB6QwG05UeRuLub1paUkj0sm3c+j5PYV1rHXJ5CX0v3cHbOzykxcbBj9M9TslDq8urSE+LEpdJOz7TY732+tpr9c+8YMH35ZcYipc6w8e3EKGTobn/y8nw2uICYOjCHGZqbQYMUUonHnbtL6+0ooEcHiTXXEpIczITOICJUT81qpk9OXNwYH8eWawxwMiGRiSij2RuPR/h0sKmTDN6/x6U/rCB16Fy8OsPLjjHcp9RnI9VcMdK+x1Oxaxfvff8UlPc4TAjp23JuKNvPjxm0kpAdRWCATfbsRfXIP4kNb+tzWUCLOo5Yb77qF9BA9B1d9xmfiNB4eM5xfN9WL7dVgDDifv15+BhER0e7lAGVTj4o9G3jhH5OFFI4zNlFAv+4L5IZ2bLHi4B72Vs2k/uA61HFGcuuN9L/5biYMjiSwaBsHuo9k4kVZqLU6KtdN5/nvlrG7KJHnvn6S7s2e2CFkUFm+g9KIOuzit3VHZqyEOb1GjCPpiWeZ9nUyfcOK+HGHjgkPDMLfp4Z9BxoJ6JnEkbhDq4snObmeQ6U1KNGWtgNxZSxYy5PPvIdq2AO8f/clJIUelzpSyGfl1y/z+qombr/rQXpGqGnIX8GHHy1j3MRHuPrMU08T+YcSkKuugM/n5qKKaUmD5x/alclTXzguBHvOE4KJtDaKB4zoOoRHXhnLmQPS3SlZW6OpOJefdzhRNzVh8/WXjms/gFAOBYk78BPlpaz5KGUpi8tVjXZW7ja4CSc1Wu9e/1HCsiA/z3qPoniC/RRv0rIIrZWR7hSmw1elIkEsLylARV5eOfOr4ZVREaSIkgjJimRmXj7Lq6Ixlpqo9wskPcqXqNgjluogVq6htWtIifAlulVdbWYzMzfXkNajE5eleRK6p0Ur+YoNPL+lnjOHZjAqMcCdHvXWoUYmzjrMtt6hKE44LCKIUZlhdBd1EdwzhFdLGjg/M5yeMTpS+4TzwZcV7JUQM11mkFOU2bJdNXRKTyRT2bVCrtM9MRiL3YXLbmOD1cXm/Dp2VsehDJGyEeJ52TFc1jXY7SVjz4ln0UcH+eVQFH66Jr4/5OTuCfGcGaNYsB9prdrko1JySOsIlYEIDdTRKVyPTlj9ljNjmPRLKTM0Icyu0fLUiEjiAnxoatW/KQGBpNz0KMmhT/LUDpPQroouieFsePctXjEeZuK4oaz49ntih01kdPdj87waSnbx0TeLCDjzWs6qPMg8p4XiHQv4esZ6Lr3mIglvktBLnXxUGrSGA8z56l9SLx9sVXswxYwiNDQAQ3gQOUkq6kPjSEtLcxOqTcJJmzOGqx+RcOjCUUQfn8LVVMXSZXnubJdKWH9EYSvQ6MIZe/vjxInymPfF84QNvp2B+goaQjPITDDxdb2Vw/WQKNdSNHFq8u307TuQm2/7gtarPXZbNYUHdrDRlovJMkRUT4sjb7JoCAjriaE01525UiWkVV9bLzakEZtvwqnVtrrZoHbnYVfUzcngctqwuWK5/PLRJ5CPy2pguZDPK0vruO3+RxmeFYaj5iDvv/UejX2v4paL+v4mUvlDCaiusoFe546WiTzrFH9QwPSP3mOjsm+K4KvPPF9XF+fTFBBNYnjA0Q5cuSyEUTdNYVy/9pNSKwv8UcFaQv3VVNTb3SHZ1gIjxdVWd6gVG6qlTy/Zz3MAACAASURBVCd/iRxU7Ck1Uy7fKZscKqSmEFKoEJNPe/wmJ5bVGtlTaeCVOQfcWRRd8p1GjDdUrSUp2ZdXFxRwjcPKlAERDEgIILgDnWuUsGhlnYpbo32P2U3CYjBS4tBxaYS+ue1StyA/CWcdVFhwE1CwqIEQvceF+Ykr85XPYcriuXxW+wuxSr1Mzbezq8uqmVOl5jZRH77u6zhYvEbZobWWcKmjRplkqhYz1YoE7Rbnf1Si6/18Sfd1UmOysb+2gRJdAH1Cf8MqknRoqjDrVVsreWRZFbeMTiMnWLlex/eV1Vo/eg2/kdSMM3j/nw9w8RuPktj/Ml6+c7iQVsv1TSXbeO/1b/A7ezzXnpnC7AVKI0IYcvndxKUu4cvv/sn66FFcc9U5JCT14vabb6eqOpc3l5Vy12WihHKG4Di8AHt0IElaG/VHChYvv2H2h3w4d6vn89J5nv82lrKrFNK7xreEMXO/IuPc66W8YQQ0Z4e0Cjlt/mUZW76fQ/5OUUBry1kSkcq425PIrqliX0Awmj2bKG68mC4dLA42SbTgEzuWwcF1FEsoF9GsjGxNxfzrtXcIu/AhHrh2MHqXkTWfPMnDT75G1lcPEuXvT6Fy+54jgZxVCDWA8LAgCdFOdfBORO3eVfySr2HKQ49xlrJvtaOBn95/maWWvrx6+xhCLaXsqxZHHHtqycD/UAIKS+8tXltk3uoWArJbSvjm7efYFHKk1Q7K967Bkd1dfpDG7f94AZepjHnfrCDlvFFkR8J3z01lc+dLmTK+99FB1uj90Z+wYd6xUIgkMVznJpMD5RYs4pV2lZjFc6tIidQxKCOA+DAtGw9I/Lq3iXxRRMqdMyVUS4rQERmkcd+KbxM+ymRXERMezNPj0ujkd2ysaIlO5jWVLzM2V3DlxxU8dHkWk7u3tft4c3FCGjrlUQFRIgpVHN0xRNHYDvFurR78UNphFzMK0p/CxJf6Hx1Ul52l22vRRoYyKM4TijTV1PPOhjp69U7g/rNjibXXcs0HJUd/rmRnMbbas9guYVaJUUJZITp/uw9qkx3Tb3zkw9RoJk9imQSxyfxaK0Zpd8gpPlOhC4qla0YnwjYeoqS8gf37S0iLENXg46J01wo+fu1bNMOu4dZRffGlZRdEH20A6YMv5m85OXz3zOv888k93HhNJp/NX8PoC7LQ6w9TueVnSulMZl0e4UFJ+GuL3L+1VOzh660VXDL6dj651IfdKxdSpO3K2Wek0bjyPW76yMKTb93MkSUhlagSP/2xa04BIenc8uwL7jXRT94XBTTkbsb3DhdF5UvZjnVEdupPpKGIfaJeu2QeO1mdDhuHt6+hMa4r+fMXYjnrSq4K+IXZ64voNS7LU0dTIdv3ObnyvjTPwryPP517Sh8YXhNHIf9OC2FpfgHK3g9KPGI3F1JYF8zQ6NBTepylPYRnX8DT8uceHkcTa795k6+W13L7i4+61f/uX77j4e8NPPvE/WRGd3QTornv/o26nBxq8Z59hzDhiquZOHFi89+NXH7xaHonhx+9VVf068+8+9Vsao8GQBXM++QF7p48mcnNfx/N2yRevePLKd47PlzjJhPlVrsyhU0WJ43KLXiZ6DUGO5uEfJRwbO9hC4bmME1RTKlROsID1MfcIdKqleeDHBgkTFGypHeOD6GLy8CiIrNnb3XluRlRV1ank2qTmtFnJvHudVn8JdXHvQGhsq4UJORmF9nr2aras8PotjKTO9v+iHgXK3bXUmr2kE2TUQhRG8hZEXZ+3FpDhXv7GwebDtahiQmld+BvGy5zjYHZxVbO7RVJVDP/24VwDS4NZ0gI11nvYveeen5t9RCZVa65ZE8Nh62e/eF35tVwIMifATF+pCeEkO3TxIJCI2anp/2lTdI/Jiu/FjRSofwG5bkqZRnM5dlC22lnwYYSNvuGMW1UPMa9pcyS/nMc37/NsFhM7kVXJRXltuUzmXLb7fx4IICn3/uOJy/249177mP6/I3U1dWyatVqUi+9hbuuGdTuvl7KXZ6rnnqOR+8dT+X2HXTqP5IeMjE0vsGcPfoS6ktXsWxtMb3OHMCRdeu6kp38snqte/xsdQf59IO32FxmaF4esLBnwzf8o5VtPvHGpxTUH3vdmryl/GPKvdx5/0OsWr+XH99+iHGjruTLJZtYvGiLhN7DOKtrHIsXrsRwzEN8VSz6+CWmvvwOSxfMYda2IMaO6k/3YWOxr5zPtkqz267VmlgyI62sWLmVevctdLGrNSuxxA4mK0YU+IXnYylYzbZ8CcXEWg/8spCK5N4MzEr9w+6C7pj/Li/MWMrwe57gvKwYd7kpfcZyrt9OXpv+M7XH78/eBv6kBxEVOGWowhh/9+QTjsReOhkll7jK5cBcV8jsn1ehc1bw0QuvUXvpKIz2SAm3bjtGASlQH6MVTsQRMlHuZG2R0Msgs0R52lSZCLVNdvnOhEm8++Fam/uJW2Ug9aJqlGeAOsXo3GtHLSGYD/FCOOenVPDJwmIKu0VwfdcQJg818saifHYfDMBfJlBcXAhdwwKpKq3hs0Nmas0OGgNDubG7sje7mt49ogjLP8QzcwsZ3yeKpq2FvF3ly3tXdWLihZ35QMp+dIEZ5SZUXFQgl/WMlO9Tef2nUp5YaCRAjEvZwfOeC2OIkVitTsIl39Yr9dJoP23rByh93EpN2Xhna0EtNfpgRqfqj/aaf0gQN2To+WllEXt3aoVXJTT1bSZeaXyAlHW4oZFXfzahVbn4tcrJpKGJDIjUyFiEce85DqatLWDHvkBCpb/6dImkp6Oev88s49brezBOiHx072Be2FbKixYzAwJsTN9t4soLkumTpuX6onqeXXmYHhHJ9Diuf0frd/P13CUUCLF9/95mvvr+AOfe/lduuXQYIYq36vUI8bHvMe3zHxky6FEun/SPU7JElUZHdHwsGX0HkhGdg6NgroQhEqqmDWFc3T6eWhTFhL6dqMz3wWY0UFZaSmJwPBofC2tnf8rWQy7CZ73Ku3XXMDxeTdcBl/NsKwXkhkbxji3TKTR9MJdeUkNDtaiykHhq6g3u7YOb9i5j3WE199zdj9QmNXOeeov1ef0Z0SOahroqDpcuY+fmq3jmvhtY/8WXdB19B0MSgvCx92B47/m8++E3PDH5SqKDOzH5+ft54/WveebxFe7nfiokRr/z4cl0DdXh7HUxd5y9ixnP38MvEUFiQ37cdM+99Gh3WxuXqCqj20GVl5WI4w4gKKDtuaYon/XfTeOZadPpddNbXDk4HpupyeOU9RGMu+U6ch//iPm/5nD1oNQOx+YPz4joMNXz/rNTMPe7nODts1h1sJ3NwTX+9Bh2Pj6HVmMIGsBNlw+kYPVcvpq1lNoGA42qICKCWoUw+iAGX34Htwzv2uH1FcLZL+HXjNU1/LK90X07XicTtnuiL2d2DaRePq/Y1Uhxjc096ZIitFw2MIzRfYJlULUnrAEpqqRMYg69XkNioMbtnStqrB6xLydHB+kIkknrtNnJb/BINJ1OS0KQ52ljpXtrJHavF2cQKNIgwGmjyipkE6Jzb8djNtsoafJ4CmUDwcTmJMpHrnt8eTar3X1+bIge5aFg5bqFBgcxwXohRM8t2wohWK3azos/HCCodypTegUf42nsDjuldXa3wYQEaHBIn/gr7ZCTKhqtODXKVtI2d6ilktCrU6vFLMVaGiWkqrS1tN9f5aRc2h4sdVJEmkMIpKzehlWOhyqkKSHXkfop9S+S+h7ptyPtVNkbWP72FAriLiSlaQ1fbbAx/oJzyUiPOjYHt9NC9aEmYvv1p3+XuFZPLCsw8M1jNzMv5nam3z7sROMwl/LNO+/x85b9JJ5zHfcOC+LxFz8ge/zj3HR+EqXrvuWFt2dSH5DEmOsmkVg1h2/X2rjs1onEGnL59I2P2CttL6u0E58Udky9wvuP47GbRhHs5/m2ZM0nvPhdBSOHRLCzMZTA8nKyh6Yx+/2v6XbFY1x3fioaccDbZk/j1eUG/vbIPURXrmPGqnKGDOnC3Hc+xpR4DvdMvoRIX0+ZDlsJn770Gnv0A5ny1zGi2DU01ZZTVuPZrE0XGE1CdOBRZ+O0S9+WFmOyKdMngsTo9ndiNDcU8tXrL7Fc5qvDZiR54DXcf+sYwtrgq9oDq3j5n8+w6oCNmLgE9xsFx0BU55mZQTL3HTzy6AOkh7S/6PSHE5DTZmLXxhU4k86gR1Joh3LPWHWQ5XmVnDdowHGG9PuhtEZRPivyGvl6TS07is3u73ok+TE0K5A6UUJLchs5VG0jWGbE0G4BbgLKluO6VmtMX2+tZHtp0x9Sp9MBU1MTM3cZ6Z8ZTvppeK3it8JXlNhVnZoITuxFdICRLfPmsnJfabtL1fE55zB+aA/3s14tsLFn/RL2+/ZkdE5cO788AqeEX7vYUuRkyIDjy1H2vDewae0CwrMuID36tz8VXpS7hFxHN0YdrUfb1zvxOp7zluU1MXrYifPCYihiwQ8b6HbBhb+rXv8pKO3K3bSE8O4XkhTa/qrTf2VOaKc0qUw8/LzN9fwkf0VCNr7ibSPExdvsLqob7e5wTXk+SCGfQRmB7rWa1uqnwmDDYDl5DOvFHwOl7zuFt79o78V/J/4rCUiB8nKe8uDhvC317ieeladflfftfHxcBOjV7ve/LuoTwrBuge67Zu3efvfCCy/+NPyJi9CnF8ot+ZQoHSNzgt0ydmWegeIqG1ppcZaQj/J6xsD0AFFFai/5eOHFacJ/LQEpUJ4bSovRu59QDQtQs2ZPk/tJ6XO6B7kfSAwPVJ8Q+3vhhRf/OfzXhmCtodyGVx7mU3IDKQ8aKqv2yoKzV/l44cXpxf8EAXnhhRf/f8KbE9oLL7w4bfASkBdeeHHa4CUgL7zw4rSh5cVppxXjKexioVLp8FM72HlgGTvoxKWdu6D1cWG3W3Cp9TiNB5ibX8vQzP5EnnCPTUkQb0Ul5+lUPu7XFEw2zztZUjABrZ5EdkldjEfeCPfxwd/9ftOxsNmdWJUV5naOu5rTUmg1alpStbjc74O53ypT3qM6PgNaB+V2VN/W9bbIL3zbeLL7+HKVFzVNDgd6rZ7f8qyyy+Vwt8v3mHwvrdutlGuXdutlbNpfaW/vPKuMpc3lebHUT6trx0s5pS+snn70UUs/tnpdo7nclsVFH3cb/6tvuXrxu3DUJooOreSl7ZsxHCUhGwfKi/APSSTWtyWPcEbqedyV3YvosHBWL/ic9VUX8FTfbsxb9TENSVdyWVAxC/IO0jP9RAIyG/bx6OLZJGddxuT0ZHbtKuet3HqalLeONb7cdVYcA+JkMsqknL+mkOlFNgJkZtY7fTi7Wyw39wySz56aNFY38NnGclbWCMH46bikTxxjkn1pzQlF+RXc83MJZw3L5P5sf/fb3TsOVjNzax35ysuoKjUXnZHM2CTdUYJqv1xn+/Vtvl5ZlYFFW8tYaQnk2dGxRLZqe1vlDgnYy5urfqBL70lckxJ/SiRkNZawOn8DH+eWMPnimznD//g0fdLu4sXcs/R7zho0lfu7JrVbVlvn1dfk8t6GWWwxabFLv/dNG8kdPXsQ1CpnEC4LOwo3MHPnBulHIRofPRf1uY6xCeFuIqss38Adi2ZAYAKB7pQHoYzrP4ZR8XFeEvLiGBy1h5TkEbwpf0dgMhdw/1ev0aP/TUzqnHTC5AgI78PTo8NZXmnC2VDIwkN5lNXNZpeqmDWHa3hlhYtQ+ZFfeA53du9NqMbFmrwVlPll8mDnFBpKK3nwl3LGX9iViRk61q8uYOqSMj64NIVO4kHtIcE8PT6CDF8o2H+Ym+bmkxqbxZg4Lab6Jl5dVIpP52imnRdOgNXCPsOx8aTNbGLWpsMsO2Qmw9Lsi12KAtEzaXwXouXfy9ce4JGfCsma2Jksf3WH5TaUVrVfX42NRVsq2NloZ/ueeg4F62mdOaS9ciMisrgscxdPb/mFwTHXk9bRmwiieg6UrOOHg4XSz3lsKrVz/D4J7nZbSpm1bS7LSsuk3e2/StLWeS7TYd5cOZ3SiHFSz4HYK1cwcd7nJETcz3VJrfYkcdqkHyOYdOG90o9Wlv/6No8s+oysK28ly08vCrORBp9OvDZqMt18T54Txov/Xfy+NSCHidzKcjSBKYyREGzt/pWEJE/g+SFjuD6rN71iunNZzmhu6T2a69K6EqrVYLNVsaqogCFdehMhKsZqtlGv15Md6SuVUNMtyR9Xo4lyo1PZN4fRPSLJUHIai0dNSQihe6CTX8uUV7Bd/JpXQb4+mFv7hLlJTitGnxWlb0nnKkpn1aZSNlh9GZ7o15LSQ62hb0YwsXKikno0PTGEALvVnbTpZOV2WF+Nhv7dorj6zAQuSPA9rlM7KldD19ThdHPuZu6hImx0AB8VKTE9uLbvRdyW3edofp9jL2Vh1baZbLDFMjw+6Wi7m0zlrC88SK3D0eF5ZdV5rK3249KefaSeaiJjejIizMVPu3fRiJHdh/ZSaBKHow6kb+cs6UeV9KMv6XE9pB9rpR9d7vaabI2YXFq0f+r+G178N+B3EZDVamBt7rdM27qSw2YLoWHdmdCtFynBYUT7B4nhaQj3DyMmMIwoX517PcFQvY2d5gj6RcW6L+oXEUKOysycfQ1Umqys2GsgMi6EzBBPlVovodTUmSlssrtTqSq7T6zdU4d/hA8/rSjmH/MKeGVNJSXWlvNLS2v4ZI+VsYNi6XZ8ThMhpyarg3qjmYU764hPCyNdrz5puR3X15MDOdr3xAl3snJ12mAGxoSyo/QQHedv8kEj58YFtLcNjIvSwxv45EAdY/tcRLejG6zZ2F+0iPtm/osdFmsH5zmobDpMnS5e+qNZGPuEkBEWSHVdIUUNe3nqu9f4vKDIo+5EBTXZzNSLalq4Zyvxqf1I1/m6y2myNmBW6dHaLe5zbN5HzbxoB61CchsHDu+VieEJHkzmEkrMBvRleaxU1zQzlY6U6FQS/SK5qt84ZmxfwU+55WwrL8ToWO8+w+UwUy7hzwu/vO7Od6PRBDAq50q6VOVjDkwmvnl7l4BgX8ZkhPDx7mIezNfQaFdzab8jeYtbUF/ZwGtLD1EdGsFFqTrsUv6hGhPLmxoYeX4ig/2dfLP0AA/WuHhjZBS+jQbeWFZKWnYyFyXq2H5cg2vKanlibbV7XSlQFM3F2aGE+Cg5cmwdlht5ivU9HictV6smNiyGmv1lEtY4CPidCXsNEpa9sXY2aZnXcFFcWKt2a8nuMo6vbzQT6e8n5+1u+zyXnRpDBbWqEPyPtkmDv9TP5jSi02fx2g2PogkId+/OWVP5K09sWi39qJJ+jOLirj3c/aiEuSp1EIls5fHF7+C01hOTPJp7c/oTK87Iq4m8aI2jBGSzNVFUuY8dzUmw7I5akex2SuqK2KpubCYgP3yDYkn28yMwKJGJg65ArVJ7drew29rMM67R6NFLDLO8uB5f/3QCmi0wN7eED/bYue/yTM4MU7NrTyn3/1wkxNSFi+N1qCRc2H6gmpcXH2K3OpiXxyeSLWpGuE3qpmF4rxhGdg5w5wa+ZkA0E38sY1svfzavLyBPJsmrWUG4bCbs4n0dNicmhws/kVXh8RG8fmkEDruDNRvzefDnA4SM68bg0PbL3TE4nKhDJ6lvOx3souNyz5GyAn1DqbfV4nC17AX1W+A0lTJt9XTy/AfwanqmcMkhlHtQDrtZ2u2UdgeQGBrgPu/Nds9z4avRoXM5Ww2jkk3SR74PcB+LDmtZBwqPGcjrowfKb02s2fohDy6bRsiFD3NudDC9u17GD/KnoLL8V+5e8AEPiviaNmgQQW3cdfTifxdHCUirDeWcnpdwTvNnZRF6/94d9Mg8v81FaFxWluxejDZ8AP11xUxeNIMmXVjzXQ8PDMZyElOv4qkB/dGJATuF0DxRhpWVuxrxTY3jjDCN2yump0bRS1fK0iIj58do2LlFylxRTbduCXw2KJL0UE3zvu4aYkK0mPVH07jjr9PhK1NpT6WR/EaXaDkDT87dr2T3ZnOxEZuhiHB1Anf1Djl661ytUXNW9xiytu9leZmVoeHtlSvhmt1KXkf1jdXh1868ar++Srmeb+xOu5C0smLye/SBkzIJkfINDmw+e3ly8esKI7G5pABb0xfS7nHuu5bK3cSOz7uY4WID/k2HqBDyj3KvDBk53GBCpwt3ZzNss30aP87KHEnW7pdYXlHvJqDWiIrK5sYuyTxUUigK7wy8j5550Rq/+66ozVrFtoKtdAk7w62ArLrOPDnqplZ3PWxs3vU5XygJ2AWJIXE0FlZQJ5MuRLxgsExIg9HmTm2qJIq0WMzU2dSk+KkxVjfw0uoKeuek8dzZEe6F26MVlhAlJ1nP54eMNGUHoWxGUNVowRkUzDndIrm9d6vdtyxGHvlyH/RI5aG+Ae7ngsyKp29eYGqyOVCrtcQGqjsoN4iuQRqaOqivtoM51XG5KnfoU2UoJyYgA53q9wyHivi4QbxzxaBW7S7mkVkvQ7ebeahnKg5lvcbqIvYk5xlr9HTWr2NLnYnufkKR4kA2GMz07NaTCOW5H6sNrU6PWgjT4lJJPzanjxWlqVaHEhvguY1nE0ejUXuI2uEwUW4y0Dk06ne2z4v/Zvxui6go28RBexzjI8KgMf+k5weFJ6Ez/EJerYHkqEBG9Itm/s9VTFurZpAonnXbyjHFhTMqNYCqssMcdvgyLErF9sKW7QaC/H3JjtUzvHc8m5aW8O4WHf0CbczZ1MiYwQmk+3bsXeuqG/lxXyMJUQFoRB2tzi1HkxrDhBQJoUQZtV+ujrB26xvYYSeqRGl1WF9RG/lVNURFygT9UzKn2snd9wMPryhm6jV3tPnc0BH4h2VwRUYPftw8h5DsLGpLN2MMGcy9XZJoMu3i/i9m0P2cW7g81Mj8/L0kRHSWfjSyOm8RmsTzmJAQ4b5DOn/HbPaRSP+wQAoLV/BNQwyTzshx55z2wovWcL8NbxXZ/VXuEvIMLbeSbPY6Vu3ZTGRif7JDgo4GByoJFc7qOoyaHZ+xM+oyHu+TiaXqV26Y/4V42ExCfI6QgIPy6lwckRN4a9gw9I4q3p73KoclJHsiJ9u9eFtf38S8XXVUiiryDwrg8p6hBKtcVNU0MndnI8fudOJDbEQQo7OC3FuwGGob+VTCIrvLh6S4EC5K8z9xvyPxxGv31eEMD2VwtMf6iw/VMLvAhEN+FxHqL+WFHqOwOiq37fq2vqCLvQdr2W7WcmFzPU9WbmPtZqYuns3IofdzQXTQKQRhLuobClhSUMbA7DOIU7VBug4Da/O34gzrzeAIX6pq97C4oJ6hOcedf8x5Ac1dZuLX/QtZV+/A1y+KUemDSPTTYLGWs3DbVmLSJOQOD+NQ6XpmHyrx9GNwZ0Zn5Hj6UdRWfukGfiopd5en14YxImsYXU7iHLz434SbgJRH+ysMVRjtp7DjnHvrFhfLtm2kc85I+gXoMdXt4bXt2xiSOZAE7ZHpamd/8Sry7Jn8pVdvfFUOCvPn8dDWYq7pexlBdl2Hl/lfQJDGyI79/2KT7gyeOvMcQrxz1Iv/Mfxn8wGJx119cAubLZ1w1XpvyMb61uHnX0G3NK9C8OJ/E96EZF544cVpg9fteuGFF6cNXgLywgsvThu8BOSFF16cNngJyAsvvDht8BKQF154cdrgJSAvvPDitMFLQF544cVpg5eAvPDCi9OGP/z1wAPLP+HngxFcfvUYov6D6YAdliZMtuOfqVThG+DvTlRfuXUuc/ICGX3xQCID9M3M66J823y204Pzco5N3m6p3Mq3c/Yw7NIrSArmBDhtZowW+4kHWkHr64++Vf4bp8OGxWxB2exDeQtf79sqjSxOrCYzVocTH5UWP399i3dwOmiSY0eeGdX7BaBtY9cNL7z4v4Y/nIAObV3I18uSGXnZiQTkMNeTuyOX8C79SQrzvAtmrT5IbomJrt26E3DC26Snjg1fPMDTc6qIDnFRuLuG6IwUmkqaOP/Bx/jrBd2p2ruBmd9bqdq3ik4jxnLRGdn4qi3s3bqeN+Z/j+vxVxnRNfhoKlhz1V7mzpxP1oVtE9CBBa/yl5eWk9ApjhPfanNQVVJIxnXP8/J1A5u/q2fJjPeZ9uanbKs0kNJlAH95cCqXjFDq4eDw9gVMe+JFZm4uQRU7iOvum8ykS/oQrFVTvWMet015io17K9EGhDLqtqeYeuNIIv6dDvPCi/8P8B9NkGA6tJnH77+Ns59axd3DPJvWHFj8HpM+LuL96V/SJ/YkBXQAp8NCVNrZXHp+JOs+3cfg8dHM/ewXagyWlpN0sfQfkciMD9/CP+xpLugWyZlX3s/Eklt5fcorJE+fQma4/yldz240459wPk++OYmYE442MfOfd7K48ci1Xeyc8yoP/O1zkkddwx1dfdmz8Aum3PsP/L/9iFHxdbz21OPMKejENXdcQsPmxbwz5U7Sus1hXIYvW7ZtJn7gFdx/sR5TwVpefO5BImKSmDI+B703iPbi/zD+JAJy0FhdzOatBTQ6fOncs7soHn9KDu6izmjn4La1LCcYvT6EA/uLaaytYtOa5TRG6EnN7oGrfBfWsFT8DRUUllahDoqjR480UUhKvgcrpfv3kV9ShV2jITwulS4pcUq2DlTWEjZtO4y1qYq5sypp8AkguPoAa1YZOJhbTHVNIzXWnowZNViublfy06PRBzNm8mPUJW7Hz/lbusPCng3f8PCdOzgxw46d4p25RF535LORvDVb0PYYzqNPPUK/WDVlQ6NYP/Yd8g6U0aNhGxt3NzHpxee4Y2RnfMoGUXbtrfwwfxsXZQ/n7Al3MVgbgp9WhaXmYsr2DGV73kFs9hx3gjMvvPi/ij+BgJzU5C/iqQc2s3nhRmpcwYy65zlevnsUP3z8T5b/eoh1u6/mY5UvKSl9hKsWs3+/ivuuX4ePTwr3vfUK9lkTmVWdRYK5lC27i3GFcGY35AAAHt9JREFUpHL91Bd5/IZzKF72Jg89/iFrdx7CpNOR1uti3pj+hjREQ0RGb3ISDrF+eQ0ZF16Ibut8dtaUsW17OVWH5PxGA3m5O1Eiqk5xlSz98l8sya1GFZbGjTfdSEpky2x2NtZzqKkJk0VRMW0tZunpOuBynulIAR3NM6SjS3Z3GmYuYs7iDXQa2xun2UpQt8706BJLde731Dn6M3hQHO4lo/h0zu4ay/Q1ayi1jCDFP6x5oFw4nCYCtUkkxoSh9UZgXvwfx59CQLWVNlIm3sozz73JgXnPcNv7n7Fu3HnceM+zLM1/gsH3fsUNAyNRqfzl+FTu+66ap597ie5RKvx81bw7y4E1IIVbpj5D30QdP733d1558RVGnxnOgmnfU5l8C3OmX0qwq5YdG7fjq9VhNtaxfM4MKuPsbNlSQJcQI017ixk05QZum5DDypfXsqQqlgk3TCYjCGV/YxrTg4jLXMuzf5vFofHXkN5q0cpUV0teaTkHDlcyKCWxjduFv0UBaek++i4mzd3Em0/ewcpvU/CvbGLQDVMZnhbI2lU1NAX7H03Yr5zvH6zGdsiATdksrLlahup9fDD1CYpTLuHBcYPQe9ehvfg/jj+BgDSkDbiYOyZeTpdASBh3PZlvP0tFXRP+SYkE6DWEStiUmupZA2oKD0WtaSAuSb6LlQDLUCXfhnDemKu5eHh//NROJlx1NT8suJc1eQb8/HTY6vdSXFDAGT0yGHvldRKG+FB41o08e04vsoN286ZlBZc9fzfqvRswJCaiFaLav7Oc/MIqDpY2kNE12J1YLSharqkq5IRVH5eJ7Tt2EqZyUbizAOuARI6m63FYMJhs+KWfz+PPjmHkhT1P/L0Q0L4NS9nvm4DBYEDv50957hL2qkK59aG7iC7/lUVLFrJt7XJ2nJ/pTst6slRwdmMR0596kh3agUx5YjKZwX9K/lYvvPiP4k9fhFYpW/j8W55aRVBIDAFB/ti0Cfz1wXs49Oi7vPPCozxTayGj3wSefvoWqvbl8f2ib/ncXs2WVfnk/a2IYG0s427PxFpnJL8miqHd9azbmMfZ6QNoK/+XVcjCoBCTtYhlGwxcc/sV1OzfSJVxAImBnvCsevcynhQV1mD07GO6ZF7zb6sOsKdSwrJuia3uis1moX8oo2+4lqIPZ1AaPpZ/XncRoapRXDj+TCZf9Fc+WTCIK4PCCTSWYnUeeYzAgcXoFIWoR9XMM/Vbf+aL3CaeePNGL/l48V+D/+hdMPe2M/I/h7PF3/uoVPLZdYICUHawcE9Hp5Wi/buoqQyhc2I44dmj+WDmKCrKD7Jh2fc89eL7vLvkAp4cM4kXR0uYUrWeN82igF56kBRbIZtKajmwbSd7gpKYdGUSXy5ZSeMlvfENbL2A4sLSUMWPM9/ncPoohvntosS/D49eMZKZU55hzf46Lu/l2W0jInskr789UoRQA/M//xe6fuM4JyeR/d88xv0/hghBTKLlZl7zc0jGAzxcLWGWEItVpbTZh5DwJJKTnDSaLUR0TSLQMovthQZywvxxVBez/kA14T16Etsc3/kmDWDyHUn0Sgn5U8bGCy9OB/6jBOQfHEqQ3p/5P8+iu08GURFpRMcmUluyjO/m/khDWgxJneKEjOzs3rKKeUshsHwXn7/zBpaeVzMw+CBvvjKHiPQc0iJD3c8VqewawpyHmP76Z2zaVynEZaGmuoGCv91IXVMk9069n3XzV9Nt+BUM7x/F0u+eZcGucq6VsOoI7E1lfPTYP4jp2ZdbOmuZ8dJc+k14ik6RXRg9vh+vfPYt/dIn0TmgZRvjwlWf8+an85jU+/LmTrSwZ/03PHLMmlCMKLBbGdUvlrOGZTL91Y959uUwLu4bQt7CGcwpS2PqgGy6ZnSiZ9rbfPjo2wTfehZVy39gSZ6Nux4+62h45xQplJoQg9qlKC/v6rMX/x34wwlIrQ/AT996gqjxD/BzP/HrE9aZm68ZzT9efIQJ77oYeN3jfPDYcO4cNoc3H76Wt10p3Pf2K0I/dsp3zeXvd7xOZbmLnOFX8/TDt5KRqCLRr4Rnp75F4SEr/uHxjLrqEW647DxU2+wEd7FjNtnoHO1LhVmNcctaNnz9EVsKfLj/LwPQR2u5dlQmD30+gzMzHqRzqA+20mJ2l9XSffhfeOCBoax681nKUy/m/nN7ujsnY/gEzlw3hdffTeDRWy8iIkBDQ/EW3vvoC+oI5pvXn6Dmqr/Q26Kh6xmX8/QxCsgDh8OPs6+fwkMlz/Lm23fzcXUT/6+9KwGPqjrb78xkksxMMiH7AoFAgLAF2QmLLKIoULSgNbQVRWmRYrUFoSIWFUGoIoprEaj9QUV/1CJLy1J/FUFEZA37nj0hyUyS2TL7/O+dOyEJZAELT6Ce93nyZGbOueece8933u/9zr33nIS0DEya8Qzu7psCldqFx2fPwMI5i/Fo5lL4om5B5ox5mJBRs8fZoY1LkLmyAG8sfx/3/icPTAkI3EC45mtCOywGlFR4kZAU69+wz+dzoCy3BMFxCYjQqOFzV6Gs5AKsTgWCdBFIiI2Awl6B4tJKuLxKaLQqLJsyAgXDFmP2+HQovQoqp2hERYQhSOmD22lGSZkRTqcUyqjQIiYBGm8Ols7+C6LGPwb9oS3QduqOYz/k4/Yx8Vj6yhoMfWQRHhyR6m+Pw5iDJbMfRV63P2Lx1JGoOLEV6773IvPnafjH64vwf96+eGnGJLSLCQ2cEess3Id5S96GMXE0/jiiBVa//QZ8/R7B1HHDUHFsK95csRU2VyWKyr1IbBlZl9VDwjEo8/f4zfCO8DosuFBWDofLA7UmDNHRMQitzuxzM3wsQbnVSbWjRXR8FMJCgmpd1zIUGe2IiU+o87uAwM2MG25Reuku2KKJg3Fh5F+xZMpwaK5gvrWq7Dy2H8zDwOGDob+4NbQXpqLjOJjnw6A+XaG6+NKV/Ps3J224a0gfkpoiUMYpbP3yJPqMvAutWlwe4kjp67ceQUJcEMrdKQ3c/RIQELga3JAE9OFfpsPUZzp+d3cvBItXDQQE/mtxwxGQgIDATwdCXwgICDQbBAEJCAg0GwQBCQgINBsEAQkICDQbBAEJCAg0GwQBCQgINBsEAQkICDQbBAEJCAg0G/wvFTktwOHDQGwa0DqqJvHMAcATD7RPhLxbhAc4y3xVzNNRCxzIBTp1ASJCGyi9ITjl+iLa1q3vusIM7DrEqqt30mH7+/QEwq7Bi+WVRTyfEqBvV0B6Tauo1IKTlawoSIX0RB2ia60cb66w4pDRBbcXaBkXjg7S2j4eDw4XWWGwX7ooiRIpPL61TuX3FI2VK8FQbsVhg+uydIvVzvLtkBaXjYzUoWuU2r9VkQw3jmZbUer2ISRU7T8u7OLrL14UsF1nrfKCae2S9GitVTbZXmSr4IisZTdXiKIz8B/XOrp+z5h7FCjm9e3ZHlA38opOffmcZcAPxwEXbbhFSyC9g/SadF1UjwNzrX0MUtIvb09T7RS4cqieJ5wFwMzfAwWtgGFpcoKtFJgxCljHTrlnsDyw7IXArMeAczSslDxg0iKgxxB+vloSYdkzpwMmGkFGyrU+pfpRthu4axo/cHx4bcAXq4FTPLdbete/4vOVws0yli8AdpDg7uzrwZ4DhXjr+1KUKZQ4lWPE5ycd6JESBun1srM5Biz6ZyFOQQF7pRkfHLUhOUGHlmofDuabccroRKnV5f/LKTBg8Q4D2qREIj1Cgd37GypX4d8v7OjxYqzYV4Z8twLl5TYUe4KQGhnMc7Xg84PlyLa6kX/BhDX7S6GKCEeXSHao24Wte0ux74IDpTYntrHtOyzBGNAyFKEKqb3l2HTagmK7G2fPl2JNtgtdksIQq/Q22N6WiZGwbQvCK58A/YeS8JpyTuSwinxgzUpg/hygvA0wqMvl5FDJQf+HTOajDU64HQhtwHHUl89wFlj6IrCTjsJdCaxmXREkltQ4//JUF1FC8pn2J9q5hgRjopnSTiM5JpJo34orbKfA1cGvgDQpwGCqke07eZHH0EPwql7YB5xm5znZoeX0CHoaUilJh3aH8d3p3ZKBDX2pmi5fkf2GRQgN6Z5fA8PpGXNaA5nLgNHjSEKxP77MfF6znbwmC1husNWGlQdKEN2tPeb010NpqsTkj89jc34sJrf2YtWX+VB1SMZzt0YjnIN/1bazeGd/BboMj8ad6bUuJBXGmm2V6N4xFsOTQ6Ewmxssd2qHYBgKDXhjnxX33tEat8WHslN9sLp80LIffVotbk8PRXREEJQ+D+LWH8cHe40Y2jYJsUFBGNA1DkN1QQjlMScifXh0SyGO99IjQyetPxSBiSQUPZWUxaTHE387hQ2pEUjtGtZge+9oH4q4ycDRWcCm7zig72p8kFbSpv5OsurWD4j7oP48Hjvw4VvAIZJHdCNl1ZuPgnDzKjpN2uvLM4AYSpYYEsvLr1MBv8Y6dTXHW9mPvjBg4lSg8yXrvl1JOwWuHrKCpBvoO4CD6QiQVwFpBQocJAG1GQZ0MLJDjfJvOScBI3u2JxWQix7mH5upLKroLRh+LFsCfPov4N2XqZKeBN76jFLWKVfiZdRw5N/A83OBOfz7fDdQ+wU0j1NOn/cs8NRT9FbLWS49jpmd/uZCYE+unK/4GLCYeX7Ik79n76UhrWCbaDjZLHP+88AzTP/qWBNnzbItNNZQejp1YGULWzkHzN/l+qX2f0ZisbOR2fz/OusoqSXLz//AdtB4C+glt39BD9mL3pSSXNrSIpp/YXS7asm1Uq1ogoPgVfjgcFfhcJkSPZJ10EtrI7Hifu10OHu6AgZn3dfxivINWMtznDAgDgmqxsv1eT3YfozxRYIevSPUsDs9sDPMCAu8xSutOBlH8pGK8fG8QxiTSLuqBgU6Xu8nn4AxsE1h/K4OxBUqftdXh3kKBaJ0SoQoFZcRyqXtVXIQ30P1vG0DHZkDjSKCSmL6TDrAW/i5vi2GeGkOb2GfGoCpjwDVe0S6aHcrnwH+ecDPMQ3mczDfwYN0Mgy3o3iiCtbRm8rMSXvJZtrXVDTvvEc1zrxVVLN2tl9XT1zVZDsFfhQuLiyTxk5RvQucyCH7swO+z6LEnMhOsQJ79wN3M24+RwLqcis9CAeuVZKjnwNDxlKmsuPW0ytUciAuZSd1Z76/vAKEU74+1B84sB5YxPT76RV7tWC4wuMOZ5P0AnVv58Bf9k/gEcrktjSk914A5pIQFjxAT0oCKOoI9GP9R74GVtBY3AwJ+yYBx3awnSTCn9EIn2V991E+96TKuVAO1LeZjovncoBeGTy3d0iQY39Jgo2QY//XGIIWUwX+lmGaVUp/jgTIv9tpbCtJQLE9OMDYYCWt/ct1wEmeh46edscpYMSkwBqFVBv3dG2Blw/l4n9UcXCVGuGMisS4ZBbidiJc4UGJzQNpB2mJSCRC8Lq9sNVupMeFzVmliEuNx+CYwFBvpFyXy4ms81YYooPw0voKSEv6q1QqZA5pjeFx8lyPwWhFltGFwguV2F0ZhIlDo3HRwdsd2FVkR6W1ClsOVmJE/wR0Dg3UK831FFpR5nBj1zEDfC1jMKaNti4B1ddeIrYTm01HUkjnlZT4Y82Tqvs4Q9y1wJjfAMm0q63F8u8O9mU2Hab6DjmMaiifi317mqTUL7ZGibWIIUHT8vPZNi/t5zykmTDaOh2ZnQ74IG3uLMmqFUOsDjeRwr8ZcZHrNQn0DOEcoCc44LOB41QlvUkofcj4R/ewg+ktsqgs+vaQ54MuhUpLwqLc7tcZGMAwLoPks+07eXCv52Dv/AuGblRZ7dmpEybwfyDsqSJZrGX64N8BIxmXpzG8m/oE6/+U9dEq7qLkPc76y9meEwwH0zOogL6m6iHDHKGh9RlIwqCkzqYVtU8BOrL8IYPqn9fx8pjccyyPxpnCQeEg2RayfWdpcNtopJMeJ3nS0w0gqd7LMj5aTcPswPay3G0kuyqXrMq+IuGNGck0GquBVt0hsLqrl1LP7GToolGg3FSFItandTiRbfFQsWgwurMa2/aV4YzJRdVmwfp9Bpx31Z2HKC8y4rNcL0Z11CNc2XS5HqaVmh0osAThobEdsPK+VIyOsGPBpgLkS5PEXi/MlHvHL9iQb/MhlP10gdK0uuOtPKnDxVacqfBCFaZCkcUFa7Ui83hRWFHFY+1wU4EFB/tgIIGiifZKUHOQR/B7seGK7LBeWAqogF+ll+wNjBtYd8I3jOUvoGN7aBhJo5F8HpOsXpW1flQo5O88Pdz3rKyqo/g5mbb+WCaJibb0LcueNhv491E0uWOJwI9HDQHRMAdTBe3j4DpFBeCkh+/Ev27sVAsH/ln+dpIdmd6u/pheutvQqnoFUcoBLTvZRndcwVDnBEOodKqY6jsvUl3aQOztZPhWyEHYNbWmMTEkB2mH5FJKgy5UHSWs+wiJ8UQ2kHkfBz5Vx1l+PldEwuvK6COFcTmJ5IEHqaQ+pse7UP/JVs8BTaPKeYqK58AaYDPDuAKSiobE077WHvDtSaROEoyLTDbqXnrJr9hOKp4synxFGkmqq38OFx56yur9vApyjfhrlgWjhqXgD4OS8Oc7WyHNY8E73xtgVgXhFyNTkRnjxuLN5zDn38VQRoWje3wIoqoXSyNZbD9CtxwbiQFJNTq/sXIrvCSGoBCM6B6FjmyIKkiFAWmxUJeXI8vs9Y+0lNbRmMbj/jSiDX5Bj/7ut0XIMskko4sMw6MDkvD44CTM6anH0aw8rMuVd/xAsNo/1+M/dkhLhJeW4pW9FTBX30lsoL1+w6I9BLGP7c76+6JJsAmfvMkQi33Zn05g/07ZOZrY57v3UW3bryyfhWo9xiff/by454jUfn6JalG7wUAindcj02T7+BPV7x3s+xeWsS4bBK4TavwCVU1nKp5yxsu7GXLdQk+iZ+eFt2cH0ot8RnlroW5PadVIaZfCJXsPL6WtyV7jSaqkeaOAASlopAqXnF4Nu02WxHqmJTF2b8sDv+HAN7emkY2g4qDxbGMYVKqT25NMklxEQ7mPJPfyo8CMxUxrYu5BT7LswrCulB5aUgU2ko2jlnM3UZmF0ABD+deZYWc60zZ9DayjEhpIQkpQy3NIwTw3s3+8elEmqRNlKHpJE77SxVWGoHNcEPIuWFDmkuZUNJg8OhXvTUjDsnHtMTQxCL0StQhTB1ZlrDBj3Xkb0jtEyXM/aLrcCo8abaJVsDq8qN7Vx0dNpSYRBavr3gOXduNol6hDiJ0K7LJb6EB0jA5tQxXIM7suS9No1OgRHwoT1ZM3sIRU/e0NtIEd6GU/6672EY0ApNvl7dj3k0eRABjuH6fazaZyNbK/TpylLTquLF8Vm5oSxt+KZJuSUFYs7UcHtNQ1WD2C6Yx6U5ErrbJiErg+UNb+1J4XPJ4D6iN6jrRO8jyF1BHpDJfWbgVaM4RKucp1SINpgBkM276hpC0JkIzkpc4HJpJD6YVuJcmt/5ByPZD+A9WGmgqjJ0lCE0m1QdX16QaqJoZnSTSmLinA55so8TPk9lioflIZMs2jJ1xGOV12UlZPjaGQ0vowvWYqSa0jCaw1w7iN3/ofUYKdSudfX/K8SXZJJBoNFdnPbmMblgNnkvn5FrmMiGg6fw68E/5zUSAmQoOkKgu2lzilR6Zgr7LiqxwH2iRGIJ4CwUCWNTikge9DUUEFNuQ6MShND62/F3zIK7XgvCUEI9vVDiAbL7eVTomMDuHIPmtEtqR4mONgtgnalpHoGab0P3eUbZaZ1eNyY+c5M+Jjw5CiV8HpcOG4wQFXgIuyC8woVmrQP0muv9BgQ6UrQDYmG3aXeDAgRQeNX8o21F4Z0k2Kch6a0Nhtq0agpt0MzZTViP9vKsOrYezvbgyV7yd50BkeZX8VkCBubSRf+yRgBMlpz9aATZBbd33Dvh3DPHQgBVTXB7LkfjfQHgwWuf4qEtYXVMfpPRu+5S/wn6PObI6WndWHoUgOw6LOKTI7SQTSh8SjYKf1710r/JLuFgT2n1EwY1g4Lt49kRBCogjloAvm/4fnAQtpGM8+A7RgnliNHDZJ+f3pzwNvMW0eZa+GlmCk+pgxl2GVdNeCY+eWfrSbfwG3U5Wpaev9GCqu2Cg/SCi1x0Hy+JAExvGDMnq+Bx6icUVecqbMqKDK+dsrwBYabx7DwiFPAGOo+iJoYDOmA2++Axz8Un5WRM+ypz8YOF+Ot4yxbMPbQPeHKdXDA+fNOvqSPHduZ2jYU4HkVtF4coQXq7/OwXeRalTZ3NAlRWP6wGiE+7w4WVKJD05a4aSCsLlU6NchAcNbBgYvf5MWpA+P16OTpvYsRhPlqhTo070VJtlz8cK2HCQEuWE0KzFjdDzi6EEKWOaawyWQnl90UfmY2aFPDEtCSqh018eDQ0eL8L8cxFanFyaLE3cOao1R8UEMUzzIzjFgS6ETDlqCqbwKIcnxmNVNj2BFY+2FP7w5TRXtYh+3vIpnxDQ61HpA8nKoaU/aQKQnbaC7cCKdEdXuLCrS4AbySQm30R5yXwZeXEC7pCpzsr+fZCgubQiw8TWGby755saeT4HVdL6pdLgmyanQBmZOQM3GAVfYToErx2VLsloZ0hvZSXEJ7KzqmyFUJsUkpRYkKF2gM3wkivxSOZ9kkAZ+DqKaaRFSU04FPWtijExk0vdq76JnB3v5WamvyV/FQV9aKX+WJrSrj/PXTwMpoWyOSpYnl70kpVJ+D4sPtIdnYCyVb61L80/SXZdL58ml9uYV1/rh0nwso4LpJin6UMh3SvS1Nn2XnveZSiKdvQIYnFLr913A4+8C818FukXLBVWYnDB5AuXogqEPhELSpTZwkJM/OEhUSNTVbaWkUMrYznhdPbP8jZTrTyVh5AUmZ6Tb54lhqovXz8J4xRiIqrQMpWJqbQvrdLhRHJhYViqViNcHbvVD3hyylCGXP1pjHBKtD65zi7qh9kpPHc+dRfUxiaHR0Ct8Wjhw/X0k98iw+rNIdlhGu4mP8fMfDCQJVdTl+Wvnu9gma82EuJb9FBMIv/x2yvwJSbJNFhlrjomuZe9X006BK4dYE7oJeDlwrSZgzSLgHNXhc4+jzm4YLsr6918Ctod4kZBewCvqbrCsnwKCSTcdj7bEDkcQFj7NgS7CF4FGIAioCeR8ByxeBST3Bx66n56ynolLyeMWUb15g5uY+f6JIMoTAjtDnxh903kFftoQBCQgINBsEC/zCggINBsEAQkICDQbBAEJCAg0GwQBCQgINBsEAQkICDQbBAEJCAg0GwQBCQgINBvqe+b/msHrccJmcyBYG4bgelYnt9vM8AbpoA2u5kEvHBab/10pCRpduLQYoJziqoLVHnjKWKGCTqeFUryPIyBwU+O6ElDurg/x+DNLMeSpTzBrTMc6aS7jScybkonjXWZh1dMTEKFRobLoCD5Z/jF2ZxfB6yhHh7FPYtrPB/rTzmx5FU9/dEpen9ipRI9BmXh08m2IqW91NAEBgZsC1230Ok3nsG7137HzQB66WOuuoufzWLHzk2VYu/U4YuJM8o9eF2zlHmQ8MB2TU2NRcmQjHpkyF9GJ7+HhYe0Q32Ms5md0RZdYwHDoczz4m4Voe2sv/Co9pp7aBQQEbgZcHwLyVGHH+29jr6sTbu/rwaXvI144uBnvfVGG0Zmjcbr6R6UaiV16onr54MiUHugW6YCx0uz/HpHc/eI6xi1ikhHWogJnciyAICABgZsW12ES2of8Q5uxarsR46c8jLSoukt12itO4aP316HNnb/C2F6JdRvg9cBsNvOvDLs3fYwCTWdkdE+pQ2BeeyV2fLkF53xp6NfpP9hPR0BAoNlxzRWQJXsPXn/tXXS4+1mM7haLA7XSPFWVWLv0WRxQ9MPccYOQv3Zj3YMrz2P1X9/F3tOl8IRFYsj48UiLrrUoj9OCTcvn4sWNZXjsmecwon0ja2oKCAjc8LimBOQxnsPbS+bjdOwovHpHd7ht5+D2gf8tsFXZsP/TV7EyS4tn5j+EBJUdZxxueBxWWGx26DU6KCLb47E5i/1l5e3fiKdfeAkn7RGYP/FWaCmDKs99i+VrvsOomX/Dr4d3uSy0ExAQuLlwDQnIgwu5x5FXKm0Vsw/zZx8i81ixf08WnCULoau6G5EnT0DrduHjV2biY4ZqhvP7cLAgCwveDMEffjcFneJr1hZO7jYc43qvwhsHjsH1y4H+bTc8yhD0HjAK94zoKMhHQOC/ANd3PSDLGfx50m+B+9/Bgvs7103zVOGr5U9i8eF0fLRkiv9Wu8NhR3BIqH+fLI+1FGtemo7t2vvwxsyfQxskbafioJLyQBumRT2PFQkICNxkuGEeonFaDNi2YRUqNZ2QFBGK7F0b8EVlGzw2cZiffCSFlb1rDWbNXY/JK1ZhTMeIpooUEBC4wXF9FZDLhD3bd8CbOgQZbcPrpnldKDrxHQ4Zo3HHoK5+RVNlyMa2rVtQZAKCNQkYPn4s2oZX78PhhanoBL7+5hTSR9f+XUBA4GaFWJJVQECg2SBeRhUQEGg2CAISEBBoNggCEhAQaDYIAhIQEGg2CAISEBBoNvw/G5hG10E0DDoAAAAASUVORK5CYII='
    ]
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
