<template>
<div class="sidebar">
  <div class="date">{{ formattedDate }}</div>
  <div class="day-type-select">
    <!-- @TODO: SideBar도 장기적으로 새 창에 띄울 수 있으려면 dumb UI Sidebar 따로 빼야 -->
    <!-- @TODO: Day 스타일링 다양한 색에 대응할 수 있도록 수정 -->
    <!-- @TODO: Hover시에 label 바뀌게 -->
    <Day
      v-for="(dayType, i) in dayTypes"
      :key="dayType.id"
      :class="`option-${i}`"
      :color="dayType.color"
      :is-selected="dayTypeId === dayType.id"
      @click="onDayTypeClicked(dayType.id)"
    />
  </div>
  <div class="day-type-label">{{ label }} </div>
  <textarea v-model="text"></textarea>
  <button class="save">저장</button>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Day from '@/components/Day.vue'

import { mapState, mapGetters, mapActions } from 'vuex'
import { Day as DayT, isoDateToUnixDate, pad } from '../store'

export default Vue.extend({
  components: { Day },
  data () {
    return {
      text: '',
      dayTypeId: undefined
    }
  },
  computed: {
    ...mapState(['selectedDay', 'dayTypes', 'unixStartDate']),
    ...mapGetters(['getDayBy']),
    formattedDate () {
      if (!this.selectedDay) return ' '
      const { year, month, day } = this.selectedDay
      return `${year}년 ${month + 1}월 ${day + 1}일`
    },
    label (): string {
      const selectedDayType = this.dayTypes.find((dayType: any) => dayType.id === (this as any).dayTypeId)
      return selectedDayType ? selectedDayType.name : undefined
    }
  },
  watch: {
    selectedDay (newDay) {
      if (newDay) {
        const day: DayT = this.getDayBy(newDay) as DayT
        (this as any).text = day ? day.text : '';
        (this as any).dayTypeId = day ? day.dayTypeId : undefined
      }
    }
  },
  methods: {
    ...mapActions(['setDayType']),
    onDayTypeClicked (id: number) {
      // @TODO: 원래 dayTypeId가 있던 날이 없어져도 괜찮나..? 아닌듯? db에는 어떻게 반영?
      const { year, month, day } = this.selectedDay
      const offsetFromStartDate =
        isoDateToUnixDate(`${year}-${pad(month + 1)}-${pad(day + 1)}`) -
        this.unixStartDate
      const dayTypeId = ((this as any).dayTypeId === id) ? undefined : id;
      (this as any).dayTypeId = dayTypeId;
      (this as any).setDayType({
        offsetFromStartDate: offsetFromStartDate,
        dayTypeId: dayTypeId
      })
    }
  }
})
</script>

<style lang="scss">
.sidebar {
  padding: 16px;
  color: var(--body-color);
  font-size: 16px;
  .date {
    margin-bottom: 12px;
    white-space: pre;
  }
  .day-type-select {
    position: relative;
    height: 33px;
    .option-0 { left: 0; }
    .option-1 { left: 33px; }
    .option-2 { left: 66px; }
    .option-3 { left: 99px; }
    .option-4 { left: 132px; }
    .option-5 { left: 165px; }
    .option-6 { left: 198px; }
  }
  .day-type-label {
    font-size: 14px;
    margin-bottom: 12px;
    white-space: pre;
  }
  textarea {
    color: var(--body-color);

    border-radius: 6px;
    font-size: 14px;
    padding: 8px;
    margin-bottom: 12px;

    outline: none;

    &:focus {
      padding: 7px;
      border: 1px outset black;
    }

    width: 100%;
    height: 300px;
    resize: none;
    background-color: var(--body-secondary-background);
    border: none;
  }
  .save {
    font-size: 14px;
    border: 1px solid var(--body-tertiary-background);
    border-radius: 4px;
    padding: 4px 10px;
    outline: none;
    color: var(--body-color);
    background: var(--body-secondary-background);
    &:hover {
      background: var(--body-tertiary-background);
    }
  }
}
</style>
