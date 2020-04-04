<template>
  <div ref="dom"></div>
</template>

<script>
  import echarts from 'echarts'
  import { on, off } from '@/libs/tools'
  import { getToken, formatDate } from '@/libs/util'
  import axios from '@/libs/api.request'
  export default {
    name: 'serviceRequests',
    data() {
      return {
        dom: null,
        option: '',
        temp: ''
      }
    },
    created() {
      console.log('页面初始化开始')
      this.fetchList()
    },
    methods: {
      fetchList() {
        console.log('开始请求')
        let that = this
        axios.request({
          method: 'post',
          url: '/main/statistics',
          data: {
            gryear: 2020
          }
        }).then(function (res) {
          console.log('查询返回值', res)
          if (res.data.state == 'true') {
            that.temp = res
            that.mounted1()
            that.option.series[0] = {
              name: '总金额',
              type: 'bar',
              barGap: 0
            }
            that.option.series[0].data = res.data.grcb
            that.option.series[1] = {
              name: '总管理费',
              type: 'bar'
            }
            that.option.series[1].data = res.data.grglf
            that.option.series[2] = {
              name: '总成本',
              type: 'bar'
            }
            that.option.series[2].data = res.data.grcost
          } else {
            console.log('错误异常', res.msg)
          }
        }).catch(function (error) {
          console.log(error)
        })
        console.log('结束请求')
      },
      mounted1() {
        console.log('页面渲染开始', this.temp)
        var posList = [
          'left', 'right', 'top', 'bottom',
          'inside',
          'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
          'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
        ];
        app.configParameters = {
          rotate: {
            min: -90,
            max: 90
          },
          align: {
            options: {
              left: 'left',
              center: 'center',
              right: 'right'
            }
          },
          verticalAlign: {
            options: {
              top: 'top',
              middle: 'middle',
              bottom: 'bottom'
            }
          },
          position: {
            options: echarts.util.reduce(posList, function (map, pos) {
              map[pos] = pos;
              return map;
            }, {})
          },
          distance: {
            min: 0,
            max: 100
          }
        };
        app.config = {
          rotate: 90,
          align: 'left',
          verticalAlign: 'middle',
          position: 'insideBottom',
          distance: 15,
          onChange: function () {
            var labelOption = {
              normal: {
                rotate: app.config.rotate,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                position: app.config.position,
                distance: app.config.distance
              }
            };
            myChart.setOption({
              series: [{
                label: labelOption
              }, {
                label: labelOption
              }, {
                label: labelOption
              }, {
                label: labelOption
              }]
            });
          }
        };
        var labelOption = {
          show: true,
          position: app.config.position,
          distance: app.config.distance,
          align: app.config.align,
          verticalAlign: app.config.verticalAlign,
          rotate: app.config.rotate,
          formatter: '{c}  {name|{a}}',
          fontSize: 16,
          rich: {
            name: {
              textBorderColor: '#fff'
            }
          }
        };
        this.option = {
          color: ['#003366', '#4cabce', '#e5323e'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['总金额', '总管理费', '总成本']
          },
          grid: {
            top: '9%',
            left: '1.2%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          xAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '总金额',
              type: 'bar',
              barGap: 0,
              // label: labelOption,
              data: [320, 332, 301, 334, 390]
            },
            {
              name: '总管理费',
              type: 'bar',
              // label: labelOption,
              data: [150, 232, 201, 154, 190]
            },
            {
              name: '总成本',
              type: 'bar',
              // label: labelOption,
              data: [98, 77, 101, 99, 40]
            }
          ]
        };
        this.$nextTick(() => {
          this.dom = echarts.init(this.$refs.dom)
          this.dom.setOption(this.option)
          on(window, 'resize', this.resize)
        })
        console.log('页面渲染结束', this.temp)
      },
      resize() {
        this.dom.resize()
      }
    },
    beforeDestroy() {
      off(window, 'resize', this.resize)
    }
  }
</script>