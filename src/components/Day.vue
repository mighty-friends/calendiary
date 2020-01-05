<template>
<div
  class="day"
  @mouseenter="hover = true"
  @mouseleave="hover = false"
>
<!-- @TODO: today highlight 해주자ㅎㅎ -->
  <div v-if="dayData && dayData.text !== ''" class="diary"></div>
  <DayPopover
    v-if="dayData && dayData.text !== '' && hover"
    class="diary-content">
  </DayPopover>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import DayPopover from '@/components/DayPopover.vue'
import { Day } from '@/store'

export default Vue.extend({
  components: { DayPopover },
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
