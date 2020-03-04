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
    url: '/main/addcompany',
    data,
    method: 'post'
  })
}
