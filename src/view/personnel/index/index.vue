<template>
  <div id="main" style="width: 600px;height:400px;"></div>
</template>

<script>
  export default {
    name: 'personnel',
    data() {
      return {}
    },
    created() {
      var myChart = echarts.init(document.getElementById('main'));
      var option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
           type: 'line',
           smooth: true
        }]
      };
    }
  }
</script>

<style lang="less">

</style>
