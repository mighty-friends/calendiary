<template>
<div class="calendar">
  <!-- cf: https://tobiasahlin.com/blog/flexbox-break-to-new-row/ -->
  <Year
    v-for="({ offset, months }, offsetFromStartYear) in years"
    :key="startYear + offsetFromStartYear"
    :year="startYear + offsetFromStartYear"
    :startMonth="offset"
    :months="months"
  />
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Year from '@/components/Year.vue'
// @TODO: 왜 이런 문제가 발생하는지 알 수 없다. default export 할 때 type도 export되나?
import { IndexedDays, Year as YearT } from '@/store.js'

export default Vue.extend({
  components: { Year },
  props: {
    indexedDays: Object as PropType<IndexedDays>
  },
  computed: {
    startYear (): number { return this.indexedDays.offset },
    years (): YearT[] { return this.indexedDays.years }
  }
})
</script>

<style lang="scss" scoped>
.calendar {
  padding: 1rem;
}
</style>
