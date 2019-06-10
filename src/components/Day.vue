<template>
<div class="day">
  <div class="diary"></div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({

})
</script>

<style lang="scss" scoped>
$day-size: 2rem;
$day-border-radius: 0.375rem;
$day-hover-border: 0.125rem;
$diary-size: 0.5rem;
$diary-margin: ($day-size - $diary-size) / 2;

.day {
  height: $day-size;
  width: $day-size;
  background-color: whitesmoke;
  border-radius: $day-border-radius;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border: $day-hover-border solid #dbdbdb;
    background-color: #efefef;
  }

  .diary {
    height: $diary-size;
    width: $diary-size;
    border-radius: 50%;
    background-color: #dbdbdb;
  }
}
</style>
