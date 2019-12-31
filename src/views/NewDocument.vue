<template>
  <div class="draggable">
    New Document
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { remote, ipcRenderer } from 'electron'

export default Vue.extend({

})
</script>

<style lang="scss" scoped>
.draggable {
  -webkit-app-region: drag;
  -webkit-user-select: none;
}
</style>
