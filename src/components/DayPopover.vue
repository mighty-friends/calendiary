<template>
<div>
  날짜: {{ diary && diary.date }}
  <br/>
  종류:
  <select>
    <option value="">ㅇ</option>
    <option value="">2</option>
    <option value="">4</option>
    <option value="">ㅊ</option>
    <option value="">ㅁ</option>
  </select>
  <br/>
  내용: {{ diary && diary.text }}
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DayDiary } from '@/store'

export default Vue.extend({
  props: {
    diary: Object as PropType<DayDiary | undefined>
  }
})
</script>
