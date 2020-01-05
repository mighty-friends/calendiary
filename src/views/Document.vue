<template>
  <div class="container">
    <div class="calendar-name">
      {{ name }}
    </div>
    <Calendar
      :indexedDays="indexedDays"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapActions } from 'vuex'

import Calendar from '@/components/Calendar.vue'

export default Vue.extend({
  components: { Calendar },
  computed: {
    ...mapState(['name']),
    ...mapGetters(['indexedDays'])
  },
  methods: {
    ...mapActions(['load'])
  },
  created () {
    this.load()
  },
  beforeRouteEnter (to, from, next) {
    document.documentElement.setAttribute('class', 'document')
    next()
  },
  beforeRouteLeave (to, from, next) {
    document.documentElement.setAttribute('class', '')
    next()
  }
})
</script>

<style lang="scss" scoped>
</style>

<style lang="scss">
.document {
  background-color: var(--body-background)
}
</style>
