<template>
  <div class="container">
    <Calendar
      v-if="startDate"
      :start-date="startDate"
      :end-date="endDate"
      :month-diaries="monthDiaries"
    />
  </div>
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
  created () {
    this.load()
  }
})
</script>

<style lang="scss" scoped>
.container {
  background-color: var(--body-background);
}
</style>
