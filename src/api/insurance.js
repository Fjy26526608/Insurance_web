import axios from '@/libs/api.request'

export const getInsuranceTypes = () => {
  return axios.request({
    url: '/main/instype',
    method: 'post'
  })
}

export const getInsuranceInfo = (id) => {
  const data = {
    id
  }

  return axios.request({
    url: '/main/insinfo',
    data,
    method: 'post'
  })
}

export const saveOrModifyInsuranceInfo = ({ id, contractnum, insured, tel, insurancetypeid, buydate, month, policyamount, cost, actualpayment }) => {
  const data = {
    id,
    contractnum,
    insured,
    tel,
    insurancetypeid,
    buydate,
    month,
    policyamount,
    cost,
    actualpayment
  }

  return axios.request({
    url: '/main/addins',
    data,
    method: 'post'
  })
}

export const deleteInsuranceInfo = (id) => {
  const data = {
    id
  }

  return axios.request({
    url: '/main/delins',
    data,
    method: 'post'
  })
}
