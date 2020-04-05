<template>
  <div>
    <Row>
      <Card shadow>
        <Col span="4">
          <DatePicker type="year" placeholder="选择年份" style="width: 200px;"></DatePicker>
        </Col>
        <example style="height: 580px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
// import InforCard from '_c/info-card'
// import CountTo from '_c/count-to'
// import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    // InforCard,
    // CountTo,
    // ChartPie,
    // ChartBar,
    Example
  },
  data () {
    return {
    }
  },
  mounted () {
    //
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
