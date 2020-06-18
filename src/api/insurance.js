import axios from '@/libs/api.request'

export const getInsuranceTypes = () => {
  return axios.request({
    url: '/instype',
    method: 'post'
  })
}

export const getInsuranceInfo = (id) => {
  const data = {
    id
  }

  return axios.request({
    url: '/insinfo',
    data,
    method: 'post'
  })
}

export const saveOrModifyInsuranceInfo = ({ companyid, glf, id, psize, contractnum, insured, tel, insurancetypeid, buydate, month, policyamount, bili, jishu, actualpayment, cost }) => {
  const data = {
    companyid,
    id,
    glf,
    psize,
    contractnum,
    insured,
    tel,
    insurancetypeid,
    buydate,
    month,
    policyamount,
    bili,
    jishu,
    actualpayment,
    cost
  }

  return axios.request({
    url: '/addins',
    data,
    method: 'post'
  })
}

export const deleteInsuranceInfo = (id) => {
  const data = {
    id
  }

  return axios.request({
    url: '/delins',
    data,
    method: 'post'
  })
}
