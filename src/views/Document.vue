<template>
  <div class="container">
    <div style="text-align:right" class="calendar-name">
      <button @click="showSideBar()">
        사이드바 토글
      </button>
      {{ name }}
    </div>
    <div class="hstack">
      <Calendar
        class="calendar"
        :indexedDays="indexedDays"
      />
      <SideBar v-if="sideBarVisibility" class="sidebar"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters, mapActions } from 'vuex'

import Calendar from '@/components/Calendar.vue'
import SideBar from '@/components/SideBar.vue'

export default Vue.extend({
  components: { Calendar, SideBar },
  data () {
    return { sideBarVisibility: false }
  },
  computed: {
    ...mapState(['name']),
    ...mapGetters(['indexedDays'])
  },
  methods: {
    ...mapActions(['load']),
    showSideBar () {
      this.sideBarVisibility = !this.sideBarVisibility
    }
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
.hstack {
  display: flex;
  justify-content: space-between;
  .calendar {
    flex-grow: 1;
  }
  .sidebar {
    flex-shrink: 0;
  }
}
</style>

<style lang="scss">
.document {
  background-color: var(--body-background)
}
</style>
