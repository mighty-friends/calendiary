<template>
<div
  class="column is-half-mobile is-one-third-tablet is-one-quarter-widescreen">
  <div class="month-container">
    <div class="label">
      {{ month }}월
    </div>
    <div
      class="month"
      :class="{
        'of-4-weeks': weeksOfTheMonth() === 4,
        'of-5-weeks': weeksOfTheMonth() === 5,
        'of-6-weeks': weeksOfTheMonth() === 6
      }">
      <Day
        v-for="n in daysCount"
        :key="n"
        :day-of-the-week="dayOfTheWeek(n)"
        :week-of-the-month="weekOfTheMonth(n)"
        :margin="1"
        :diary="diary[n]"
      />
    </div>
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
    // 위의 세 메서드는 offset이지만 이 메서드는 갯수이기 때문에 +1 이 필요하다.
    weeksOfTheMonth (): number {
      return this.weekOfTheMonth(this.daysCount) + 1
    }
  }
})
</script>

<style lang="scss" scoped>
.month-container {
  margin: 0 auto 3rem;
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

    &.of-4-weeks {
      height: $day-size * 4 + $day-margin * 3;
    }

    &.of-5-weeks {
      height: $day-size * 5 + $day-margin * 4;
    }

    &.of-6-weeks {
      height: $day-size * 6 + $day-margin * 5;
    }
  }
}
</style>
