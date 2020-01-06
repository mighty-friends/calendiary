<template>
<div class="sidebar">
  <div class="date">{{ formattedDate }}</div>
  <div class="day-type-select">
    <!-- @TODO: dumb UI Day랑 smart Day를 구분해서 여긴 dumb Day 갖다써야할듯? -->
    <!-- @TODO: SideBar도 장기적으로 새 창에 띄울 수 있으려면 dumb UI Sidebar 따로 빼야 -->
    <!-- @TODO: Day 스타일링 다양한 색에 대응할 수 있도록 수정 -->
    <Day
      v-for="(dayType, i) in dayTypes"
      :key="dayType.id"
      :class="`option-${i}`"
      :style="{ 'background-color': `#${dayType.color}` }"
    />
  </div>
  <div class="day-type-label">
    외박
  </div>
  <textarea v-model="text"></textarea>
  <button class="save">저장</button>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Day from '@/components/Day.vue'

import { mapState, mapGetters } from 'vuex'
import { Day as DayT } from '../store'

export default Vue.extend({
  components: { Day },
  data () {
    return {
      text: ''
    }
  },
  computed: {
    ...mapState(['selectedDay', 'dayTypes']),
    ...mapGetters(['getDayBy']),
    formattedDate () {
      if (!this.selectedDay) return ' '
      const { year, month, day } = this.selectedDay
      return `${year}년 ${month + 1}월 ${day + 1}일`
    }
  },
  watch: {
    selectedDay (newDay) {
      if (newDay) {
        const day: DayT = this.getDayBy(newDay) as DayT
        (this as any).text = day ? day.text : ''
      } else {
        (this as any).text = ''
      }
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
    .option-1 { left: 0; }
    .option-2 { left: 33px; }
    .option-3 { left: 66px; }
    .option-4 { left: 99px; }
    .option-5 { left: 132px; }
    .option-6 { left: 165px; }
    .option-7 { left: 198px; }
  }
  .day-type-label {
    font-size: 14px;
    margin-bottom: 12px;
  }
  textarea {
    color: var(--body-color);

    border-radius: 6px;
    font-size: 16px;
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
