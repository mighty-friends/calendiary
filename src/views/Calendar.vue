<template>
<!-- @TODO: 뷰와 컴퍼넌트 이름을 둘 다 calendar라고 하니까 헷갈린다 -->
  <div class="container">
    <Calendar
      v-if="startDate"
      :start-date="startDate"
      :end-date="endDate"
      :month-diaries="monthDiaries"
    />
  </div>
<!-- :days="days" -->
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

import Calendar from '@/components/Calendar.vue'

export default Vue.extend({
  components: { Calendar },
  computed: {
    ...mapGetters(['startDate', 'endDate', 'monthDiaries'])
  },
  methods: {
    ...mapActions(['load'])
  },
  // @TODO: 이 lifecycle에 하는거 맞..나?
  created () {
    this.load()
  }
})
</script>

<style lang="scss" scoped>
</style>
