<template>
  <div class="container">
  <Calendar
    start-date="2019-01-21"
    end-date="2020-08-27"
    :days="days"
  />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Calendar from '@/components/Calendar.vue'
import days, { Day } from '@/days.csv'

export default Vue.extend({
  components: { Calendar },
  data () {
    return {
      days: days.map<Day>(({ date, status, diary, __parsed_extra: e }) => ({
        date,
        status,
        diary: diary + (e ? ',' + e.join(',') : '')
      })).reduce<{[index: string]: {[index: string]: Day}}>((prev, curr) => ({
        ...prev,
        [curr.date.slice(0, 7)]: {
          ...prev[curr.date.slice(0, 7)],
          [curr.date]: curr
        }
      }), {})
    }
  }
})
</script>
