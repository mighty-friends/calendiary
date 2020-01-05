<template>
<div class="year-container">
  <div class="label">
    {{ year }}년
  </div>
  <div class="months">
    <Month
      class="year"
      v-for="({ offset, days }, offsetFromStartMonth) in months"
      :key="startMonth + offsetFromStartMonth"
      :year="year"
      :month="startMonth + offsetFromStartMonth"
      :startDay="offset"
      :days="days"
    />
  </div>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Month from '@/components/Month.vue'
import { Year, Month as MonthT } from '@/store.js'

export default Vue.extend({
  components: { Month },
  props: {
    year: Number,
    startMonth: Number,
    months: Array as PropType<MonthT[]>
  }
})
</script>

<style lang="scss" scoped>
.year-container {
  .label {
    max-width: 1096px;
    margin: 0 auto;
    padding: 12px;
    font-size: 24px;
    color: var(--body-color)
  }

  .months {
    max-width: 1096px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
