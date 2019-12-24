<template>
  <div class="container">
    <div class="info">
      <div class="count">
        복무일: {{ workdayCount }}
      </div>
      <div class="count">
        근무일: {{ unitCount }}
      </div>
      <div class="count">
        휴일: {{ restCount }}
      </div>
      <div class="count">
        출타일: {{ offpostCount }}
      </div>
      <div class="count">
        출타율: {{ (offpostCount / (unitCount + offpostCount) * 100).toFixed(1) }}%
      </div>
      <div class="count">
        출타율 예상: {{ offpostRateFutureFormatted }}
      </div>
    </div>
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

const daysCount = rawDays.reduce<{[index: string]: number}>((prev, curr) => ({
  ...prev,
  [curr.status]: prev[curr.status] === undefined ?
    1 :
    curr.date <= '2019-12-04' ? prev[curr.status] + 1 : prev[curr.status]
}), {})

const workdayCount = daysCount.bootcamp + daysCount.kta + daysCount.workday +
  daysCount['staff-duty']

const unitCount = daysCount.workday + daysCount['staff-duty']

const restCount = daysCount.dayoff + daysCount.leave + daysCount.pass

const offpostCount = daysCount.leave + daysCount.pass

const daysCountFuture = rawDays.reduce<{[index: string]: number}>((prev, curr) => ({
  ...prev,
  [curr.status]: prev[curr.status] === undefined ?
    1 :
    prev[curr.status] + 1
}), {})

const unitCountFuture = daysCountFuture.workday + daysCountFuture['staff-duty'] + daysCountFuture.future

const offpostCountFuture = daysCountFuture.leave + daysCountFuture.pass

const offpostRateFuture = offpostCountFuture / (unitCountFuture + offpostCountFuture)

const offpostRateFutureFormatted = (offpostRateFuture * 100).toFixed(1) + '%'

export default Vue.extend({
  components: { Calendar },
  data () {
    return { days, daysCount, workdayCount, unitCount, restCount, offpostCount, offpostRateFutureFormatted }
  }
})
</script>

<style lang="scss" scoped>
.info {
  font-family: -apple-system, sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  padding: 2rem 2.5rem 0;
  .count {
    display: inline-block;
    padding-right: 3rem;
  }
}
</style>
