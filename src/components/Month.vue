<template>
<div
  class="month"
  :style="{
    height: `${weeksOfTheMonth() * 2 + 3}rem`
  }">
  <div class="label">
    {{ month }}월
  </div>
  <div class="days">
    <Day
      v-for="n in daysCount"
      :key="n"
      :day-of-the-week="dayOfTheWeek(n)"
      :week-of-the-month="weekOfTheMonth(n)"
      :margin="4"
      :diary="diary[n]"
    />
    <!-- @TODO: > 9 ? 저거 좀 어떻게 없애보자.. ㅅㅂ -->
  </div>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Day from '@/components/Day.vue'
import { DayDiary } from '@/store'

export default Vue.extend({
  components: { Day },
  props: {
    year: Number,
    month: Number,
    startingDayOfTheWeek: Number,
    diary: Array as PropType<DayDiary[]>
  },
  computed: {
    daysCount () {
      return this.diary.length
    }
  },
  methods: {
    // @TODO: 날짜 관련된거 유틸리티 폴더 하나 만들어서 몰아넣어도 좋을듯?
    offsetFromDate0 (day: number): number {
      return (this.startingDayOfTheWeek + day - 1)
    },
    dayOfTheWeek (day: number): number {
      return this.offsetFromDate0(day) % 7
    },
    weekOfTheMonth (day: number): number {
      return Math.floor(this.offsetFromDate0(day) / 7)
    },
    weeksOfTheMonth (): number {
      return this.weekOfTheMonth(this.daysCount)
    }
  }
})
</script>

<style lang="scss" scoped>
.month {
  margin: 3rem 0;
  break-inside: avoid;

  &:first-child {
    margin-top: 0;
  }

  .label {
    text-align: right;
    display: inline-block;
    margin-right: 2rem;
    width: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 1rem;
    color: #696969;
  }
  .days {
    position: relative;
    display: inline-block;
    top: -0.75rem;
  }
}
</style>
