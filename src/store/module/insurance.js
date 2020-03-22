import { getInsuranceTypes } from '@/api/insurance'
import { getToken } from '@/libs/util'

export default {
  state: {
    enterpriseInsuranceTypes: [],
    personalInsuranceTypes: [],
    insuranceTypes: []
  },
  mutations: {
    setEnterpriseInsuranceTypes(state, list) {
      state.enterpriseInsuranceTypes = list
    },
    setPersonalInsuranceTypes(state, list) {
      state.personalInsuranceTypes = list
    },
    setInsuranceTypes(state, list) {
      state.insuranceTypes = list
    }
  },
  getters: {
    getEnterpiseInsuranceTypes: state => state.enterpriseInsuranceTypes,
    getPersonalInsuranceTypes: state => state.personalInsuranceTypes
  },
  actions: {
    fetchInsuranceTypes({ state, commit }) {
      return new Promise((resolve, reject) => {
        getInsuranceTypes(getToken())
          .then(res => {
            console.log('++++++')
            console.log(res.data.data)
            if (res.data.state) {
              const insuranceTypes = res.data.data
              let enterpriseTypes = []
              let personalTypes = []
              for (let i = 0; i < insuranceTypes.length; i++) {
                const insuranceType = insuranceTypes[i]
                // let { fields } = insuranceType
                // fields.id = insuranceType.pk
                if (insuranceType.iscompany) {
                  enterpriseTypes.push(insuranceType)
                } else {
                  personalTypes.push(insuranceType)
                }
              }
              commit('setInsuranceTypes', res.data.data)
              commit('setEnterpriseInsuranceTypes', enterpriseTypes)
              commit('setPersonalInsuranceTypes', personalTypes)
              resolve()
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
