<template>
<div class="months">
  <Month
    v-for="({ year, month, startingDayOfTheWeek, days }) in monthDiaries"
    :key="`${year}-${month}`"
    :year="year"
    :month="month"
    :starting-day-of-the-week="startingDayOfTheWeek"
    :diary="days"
  />
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
.months {
  columns: 20em;
  padding: 2rem;
}
</style>
