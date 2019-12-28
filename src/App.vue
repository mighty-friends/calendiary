<template>
  <router-view/>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
})
</script>

<style lang="scss">
@use './assets/minireset.css';

:root {
  @media (prefers-color-scheme: light) {
    --body-color: black;
    --body-background: white;
  }
  @media (prefers-color-scheme: dark) {
    --body-color: #dddddd;
    --body-background: #3e3b3e;
  }
}

body {
  font: caption;
}
</style>
