<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'serviceRequests',
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    const option = {
    legend: {
        data: ['保险总额', '成本总计']
    },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '9%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '保险总额',
          type: 'line',
          stack: '总量',
          smooth: true,
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          // areaStyle: { normal: {
          //   color: '#0C17A6'
          // } },
          data: [379, 268, 354, 269, 310, 478, 358]
        },
        {
          name: '成本总计',
          type: 'line',
          stack: '总量',
          smooth: true,
          color: ['#58afed'],
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          // areaStyle: { normal: {
          //   color: '#398DBF'
          // } },
          data: [500, 645, 546, 745, 872, 624, 258]
        }
      ]
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
