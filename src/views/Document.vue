<template>
  <div class="container">
    <div class="calendar-name">
      {{ name }}
    </div>
    <div class="hstack" :class="{'is-side-bar-visible': sideBarVisibility}">
      <Calendar
        class="calendar"
        :indexedDays="indexedDays"
      />
      <SideBar class="sidebar"/>
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
  computed: {
    ...mapState(['name', 'selectedDay']),
    ...mapGetters(['indexedDays']),
    sideBarVisibility () {
      return this.selectedDay
    }
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
$sidebar-width: 260px;
.hstack {
  position: relative;

  .calendar {
    margin: 0;
    transition: margin-right 0.15s;
    height: 100vh;
    overflow-y: scroll;
  }
  &.is-side-bar-visible .calendar {
    margin-right: $sidebar-width;
  }
  .sidebar {
    width: $sidebar-width;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 0;
    bottom: 0;
    right: -$sidebar-width;
    transition: right 0.15s;
  }
  &.is-side-bar-visible .sidebar {
    right: 0;
  }
}
</style>

<style lang="scss">
.document {
  background-color: var(--body-background)
}
</style>
