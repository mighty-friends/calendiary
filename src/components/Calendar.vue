<template>
<div class="months">
  <Month
    v-for="({ year, month, startingDayOfTheWeek, noDays }, i) in monthsBetweenPeriod"
    :key="i"
    :year="year"
    :month="month"
    :starting-day-of-the-week="startingDayOfTheWeek"
    :no-days="noDays"
    :diary="days[`${year}-${month > 9 ? month : '0' + month}`]"
  />
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Month from '@/components/Month.vue'
import { Day } from '@/days.csv'

function range (n: number): number[] {
  return [...Array(n).keys()]
}

export default Vue.extend({
  components: { Month },
  props: {
    startDate: String,
    endDate: String,
    days: Object as PropType<{[index: string]: { [index: string]: Day } }>
  },
  computed: {
    monthsBetweenPeriod () {
      const start: Date = new Date(this.startDate),
        end: Date = new Date(this.endDate),
        startYear = start.getUTCFullYear(),
        endYear = end.getUTCFullYear(),
        yearDiff = endYear - startYear,
        startMonth = start.getUTCMonth(),
        endMonth = end.getUTCMonth(),
        monthDiff = endMonth - startMonth,
        numberOfMonthsBetweenPeriod = yearDiff * 12 + monthDiff + 1 // closed interval

      return range(numberOfMonthsBetweenPeriod).map(monthOffset => {
        const year = startYear + Math.floor((startMonth + monthOffset) / 12),
          month = (startMonth + monthOffset) % 12 + 1,
          startingDayOfTheWeek = new Date(`${year}-${month > 9 ? month : '0' + month}-01`).getDay(),
          noDays = new Date(year, month, 0).getDate()

        // @TODO: 9 ? : 지우기...

        return { year, month, startingDayOfTheWeek, noDays }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.months {
  columns: 20em;
  padding: 2rem;
}
</style>
