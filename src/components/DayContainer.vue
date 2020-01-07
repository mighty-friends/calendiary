<template>
<Day
  :class="{ 'today': isToday }"
  :color="color"
  :has-dot="dayData && dayData.text !== ''"
  :is-selected="isSelected"
  @click="onSelected()"/>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapMutations, mapGetters } from 'vuex'

import Day from '@/components/Day.vue'
import { Day as DayT, pad } from '@/store'

export default Vue.extend({
  components: { Day },
  props: {
    year: Number,
    month: Number,
    day: Number,
    dayData: Object as PropType<DayT | undefined>
  },
  computed: {
    ...mapState(['selectedDay']),
    ...mapGetters(['getDayTypeById']),
    color () {
      const day = this.dayData
      return day ? this.getDayTypeById(day.dayTypeId).color : undefined
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
</style>
