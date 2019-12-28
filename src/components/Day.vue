<template>
<div
  class="day"
  :class="{
    'of-1st-week': weekOfTheMonth === 0,
    'of-2nd-week': weekOfTheMonth === 1,
    'of-3rd-week': weekOfTheMonth === 2,
    'of-4th-week': weekOfTheMonth === 3,
    'of-5th-week': weekOfTheMonth === 4,
    'of-6th-week': weekOfTheMonth === 5,
    'of-1st-day': dayOfTheWeek === 0,
    'of-2nd-day': dayOfTheWeek === 1,
    'of-3rd-day': dayOfTheWeek === 2,
    'of-4th-day': dayOfTheWeek === 3,
    'of-5th-day': dayOfTheWeek === 4,
    'of-6th-day': dayOfTheWeek === 5,
    'of-7th-day': dayOfTheWeek === 6,
  }"
  @mouseenter="hover = true"
  @mouseleave="hover = false"
>
<!-- @TODO: today highlight 해주자ㅎㅎ -->
  <div v-if="diary && diary.text !== ''" class="diary"></div>
  <div
    v-if="diary && diary.text !== '' && hover"
    class="diary-content">
    {{ diary.text }}
  </div>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DayDiary } from '@/store'

export default Vue.extend({
  props: {
    dayOfTheWeek: Number,
    weekOfTheMonth: Number,
    margin: Number,
    diary: Object as PropType<DayDiary | undefined>
  },
  data () {
    return {
      hover: false
    }
  },
  computed: {
    status () {
      const diary = this.diary
      return diary ? diary.dayType.name : undefined
    }
  }
})
</script>

<style lang="scss" scoped>
.day {
  $size: 28px;
  $margin: 5px;

  height: $size;
  width: $size;
  background-color: var(--body-secondary-background);

  $border-radius: 6px;
  border-radius: $border-radius;
  cursor: pointer;

  position: absolute;

  &.of-1st-week { top: 0; }
  &.of-2nd-week { top: 33px; }
  &.of-3rd-week { top: 66px; }
  &.of-4th-week { top: 99px; }
  &.of-5th-week { top: 132px; }
  &.of-6th-week { top: 165px; }
  &.of-1st-day { left: 0; }
  &.of-2nd-day { left: 33px; }
  &.of-3rd-day { left: 66px; }
  &.of-4th-day { left: 99px; }
  &.of-5th-day { left: 132px; }
  &.of-6th-day { left: 165px; }
  &.of-7th-day { left: 198px; }

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    // @TODO: 라이트/다크 좀 더 근본있는 컬러로 교체 필요
    $border: 1px;
    border: $border solid var(--body-border);
    background-color: var(--body-tertiary-background);
    transition: border 0.2s, background-color 0.2s;
  }

  .diary {
    $size: 8px;
    height: $size;
    width: $size;
    border-radius: 50%;
    background-color: var(--body-border);
  }

  .diary-content {
    position: absolute;
    top: 32px;
    left: -1px;
    width: 20rem;
    z-index: 2;
    transform: translateZ(1px);

    border: 1px solid var(--body-secondary-background);
    border-radius: 0.25rem;
    padding: 1rem 2rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.12);

    background-color: var(--body-secondary-background);
    color: var(--body-color);
    line-height: 1.6;
  }
}
</style>
