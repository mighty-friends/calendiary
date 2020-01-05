<template>
<div class="month-container">
  <div class="label">
    {{ month + 1 }}월
  </div>
  <div
    class="month"
    :class="{ [`of-${weeksCount()}-weeks`]: true }">
    <Day
      v-for="(day, offsetFromStartDay) in days"
      :key="startDay + offsetFromStartDay"
      :class="{
        [`of-day-${dayOfTheWeek(offsetFromStartDay) + 1}`]: true,
        [`of-week-${weekOfTheMonth(offsetFromStartDay) + 1}`]: true
      }"
      :year="year"
      :month="month"
      :day="startDay + offsetFromStartDay"
      :dayData="day"
    />
  </div>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Day from '@/components/Day.vue'
import { Month, Day as DayT, pad } from '@/store'

export default Vue.extend({
  components: { Day },
  props: {
    year: Number,
    month: Number,
    startDay: Number,
    days: Array as PropType<(DayT | undefined)[]>
  },
  methods: {
    offsetFromFirstSunday (offset: number): number {
      const startDay = `${this.year}-${pad(this.month + 1)}-${pad(this.startDay + 1)}`
      const dayOfTheWeekOfStartDay = new Date(startDay).getDay()

      return dayOfTheWeekOfStartDay + offset
    },
    dayOfTheWeek (offset: number): number {
      return this.offsetFromFirstSunday(offset) % 7
    },
    weekOfTheMonth (offset: number): number {
      return Math.floor(this.offsetFromFirstSunday(offset) / 7)
    },
    weeksCount (): number {
      return Math.ceil(this.offsetFromFirstSunday(this.days.length) / 7)
    }
  }
})
</script>

<style lang="scss" scoped>
.month-container {
  margin: 24px;
  width: 226px;

  .label {
    font-size: 16px;
    color: var(--body-color);

    margin: 0 0 24px;
  }

  .month {
    position: relative;
    display: inline-block;

    width: 226px;

    $day-size: 28px;
    $day-margin: 5px;

    // @TODO: https://sass-lang.com/documentation/interpolation
    &.of-1-weeks { height: $day-size * 1 }
    &.of-2-weeks { height: $day-size * 2 + $day-margin * 1; }
    &.of-3-weeks { height: $day-size * 3 + $day-margin * 2; }
    &.of-4-weeks { height: $day-size * 4 + $day-margin * 3; }
    &.of-5-weeks { height: $day-size * 5 + $day-margin * 4; }
    &.of-6-weeks { height: $day-size * 6 + $day-margin * 5; }
  }

  .day {
    &.of-week-1 { top: 0; }
    &.of-week-2 { top: 33px; }
    &.of-week-3 { top: 66px; }
    &.of-week-4 { top: 99px; }
    &.of-week-5 { top: 132px; }
    &.of-week-6 { top: 165px; }
    &.of-day-1 { left: 0; }
    &.of-day-2 { left: 33px; }
    &.of-day-3 { left: 66px; }
    &.of-day-4 { left: 99px; }
    &.of-day-5 { left: 132px; }
    &.of-day-6 { left: 165px; }
    &.of-day-7 { left: 198px; }
  }
}
</style>
