import axios from '@/libs/api.request'

export const addCompany = ({
  name,
  psize,
  address,
  stime,
  etime,
  contactperson,
  tel,
  remark
}) => {
  const data = {
    name,
    psize,
    address,
    stime,
    etime,
    contactperson,
    tel,
    remark
  }

  return axios.request({
    url: '/addcompany',
    data,
    method: 'post'
  })
}

export const delCompany = (id) => {
  const data = {
    id
  }

  return axios.request({
    url: '/delcompany',
    data,
    method: 'post'
  })
}
