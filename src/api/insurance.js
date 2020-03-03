import axios from '@/libs/api.request'

export const getInsuranceTypes = (token) => {
  return axios.request({
    url: '/main/instype',
    headers: { token },
    method: 'post'
  })
}
