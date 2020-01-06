<template>
<div
  class="day"
  :class="{
    'today': isToday,
    'is-selected': isSelected
  }"
  @mouseenter="hover = true"
  @mouseleave="hover = false"
  @click="onSelected()">
  <div v-if="dayData && dayData.text !== ''" class="content-indicator"></div>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapMutations } from 'vuex'
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
    ...mapState(['selectedDay']),
    status () {
      const day = this.dayData
      return day ? day.dayTypeId : undefined
    },
    isToday (): boolean {
      const today = new Date()
      return today.getUTCFullYear() === this.year &&
        today.getUTCMonth() === this.month &&
        today.getUTCDate() === this.day + 1
    },
    isSelected (): boolean {
      return this.selectedDay &&
        this.selectedDay.year === this.year &&
        this.selectedDay.month === this.month &&
        this.selectedDay.day === this.day
    }
  },
  methods: {
    ...mapMutations(['selectDay', 'clearSelectedDay']),
    onSelected () {
      if (this.isSelected) {
        (this as any).clearSelectedDay()
      } else {
        (this as any).selectDay({
          year: this.year,
          month: this.month,
          day: this.day
        })
      }
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

  &.is-selected {
    border: 2px solid var(--body-border);
  }

  &:hover {
    // @TODO: 라이트/다크 좀 더 근본있는 컬러로 교체 필요
    border: 1px solid var(--body-border);
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
