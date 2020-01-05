<template>
<div
  class="day"
  :class="{today: isToday}"
  @mouseenter="hover = true"
  @mouseleave="hover = false">
  <div v-if="dayData && dayData.text !== ''" class="content-indicator"></div>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Day, pad } from '@/store'

export default Vue.extend({
  props: {
    year: Number,
    month: Number,
    day: Number,
    dayData: Object as PropType<Day | undefined>
  },
  data () {
    return {
      hover: false
    }
  },
  computed: {
    status () {
      const day = this.dayData
      return day ? day.dayTypeId : undefined
    },
    isToday (): boolean {
      const today = new Date()
      return today.getUTCFullYear() === this.year
        && today.getUTCMonth() === this.month
        && today.getUTCDate() === this.day
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

  display: flex;
  align-items: center;
  justify-content: center;

  &.today {
    background-color: var(--body-tertiary-background);
  }

  &:hover {
    // @TODO: 라이트/다크 좀 더 근본있는 컬러로 교체 필요
    $border: 1px;
    border: $border solid var(--body-border);
    background-color: var(--body-tertiary-background);
    transition: border 0.2s, background-color 0.2s;
  }

  .content-indicator {
    $size: 8px;
    height: $size;
    width: $size;
    border-radius: 50%;
    background-color: var(--body-border);
  }
}
</style>
