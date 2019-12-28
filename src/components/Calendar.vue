<template>
<div class="container">
  <div class="calendar-name">
    <!-- @TODO: Settings에서 이름 가져오기/수정기능 -->
  </div>
  <!-- @TODO: 연도 표시 -->
  <div class="months columns is-multiline is-mobile is-gapless">
    <Month
      v-for="({ year, month, startingDayOfTheWeek, days }) in monthDiaries"
      :key="`${year}-${month}`"
      :year="year"
      :month="month"
      :starting-day-of-the-week="startingDayOfTheWeek"
      :diary="days"
    />
  </div>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Month from '@/components/Month.vue'
import { MonthDiary } from '@/store.js'

export default Vue.extend({
  components: { Month },
  props: {
    startDate: String,
    endDate: String,
    monthDiaries: Array as PropType<MonthDiary[]>
  }
})
</script>

<style lang="scss" scoped>
.container {
  padding: 1rem;
  margin: 0 auto;

  .calendar-name {
    font-size: 24px;
    margin-bottom: 1em;
    text-align: center;
  }
}
</style>
