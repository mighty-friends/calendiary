<template>
  <div id="app">
    <div class="month">
      <Day
        v-for="n in 31"
        :key="n"
        class="day"
        :style="{
          top: `calc(${2 * Math.floor(n / 7)}rem + ${3 * Math.floor(n / 7)}px)`,
          left: `calc(${2 * (n % 7)}rem + ${3 * (n % 7)}px)`
        }"/>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Day from './components/Day.vue'

export default Vue.extend({
  components: {
    Day
  }
})
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

.month {
  position: relative;
  margin: 2rem;
  .day {
    position: absolute;
  }
}
</style>
