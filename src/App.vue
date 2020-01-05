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
    --body-secondary-background: whitesmoke;
    --body-tertiary-background: #dbdbdb;
    --body-border: #cdcdcd;
  }
  @media (prefers-color-scheme: dark) {
    --body-color: #dddddd;
    --body-background: #3e3b3e;
    --body-secondary-background: #2e2b2e;
    --body-tertiary-background: #202020;
    --body-border: #111111;
  }
}

body {
  font: caption;
}
</style>
