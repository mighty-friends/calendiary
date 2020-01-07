<template>
<div
  class="day"
  :class="{ 'is-selected': isSelected}"
  :style="{ 'background-color': `#${color}` }"
  @click="$emit('click')">
  <div v-if="hasDot" class="content-indicator"></div>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    isSelected: Boolean,
    hasDot: Boolean,
    color: String
  },
})
</script>

<style lang="scss" scoped>
.day {
  $size: 32px;
  $margin: 5px;

  height: $size;
  width: $size;
  background-color: var(--body-secondary-background);

  $border-radius: 8px;
  border-radius: $border-radius;

  cursor: pointer;

  position: absolute;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid var(--body-background);

  &.today {
    background-color: var(--body-tertiary-background);
  }

  &.is-selected {
    border: 2px solid var(--body-border);
    backdrop-filter: hue-rotate(100deg);
  }

  &:hover {
    // @TODO: 라이트/다크 좀 더 근본있는 컬러로 교체 필요
    border: 2px solid var(--body-border);
    background-color: var(--body-tertiary-background);
    backdrop-filter: hue-rotate(100deg);
    transition: background-color 0.2s;
  }

  .content-indicator {
    $size: 8px;
    height: $size;
    width: $size;
    border-radius: 50%;
    background-color: var(--body-border);
  }
}
</style>
