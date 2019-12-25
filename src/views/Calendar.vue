<template>
  <div class="container">
    <Calendar
      v-if="startDate"
      :start-date="startDate"
      :end-date="endDate"
      :days="days"
    />
  </div>
<!-- :days="days" -->
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

import Calendar from '@/components/Calendar.vue'

import rawCsvDays, { Day } from '@/days.csv'

const rawDays = rawCsvDays.map<Day>(({ date, status, diary, __parsed_extra: e }) => ({
  date,
  status,
  diary: diary + (e ? ',' + e.join(',') : '')
}))

const days = rawDays.reduce<{[index: string]: {[index: string]: Day}}>((prev, curr) => ({
  ...prev,
  [curr.date.slice(0, 7)]: {
    ...prev[curr.date.slice(0, 7)],
    [curr.date]: curr
  }
}), {})

export default Vue.extend({
  components: { Calendar },
  data () {
    return { days }
  },
  computed: {
    ...mapGetters(['startDate', 'endDate'])
  },
  methods: {
    ...mapActions(['getDuration', 'getDayTypes', 'getDiaries'])
  },
  created () {
    this.getDuration()
    this.getDayTypes()
    this.getDiaries()
  }
})
</script>

<style lang="scss" scoped>
</style>
