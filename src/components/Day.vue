<template>
<div
  class="day"
  :class="{
    'bootcamp': status === 'bootcamp',
    'kta': status === 'kta',
    'staff-duty': status === 'staff-duty',
    'workday': status === 'workday',
    'dayoff': status === 'dayoff',
    'pass': status === 'pass',
    'leave': status === 'leave',
    'civilian': status === 'civilian'
  }"
  :style="position"
  @mouseenter="hover = true"
  @mouseleave="hover = false"
>
<!-- @TODO: today highlight 해주자ㅎㅎ -->
  <div v-if="diary && diary.text !== ''" class="diary"></div>
  <div
    v-if="diary && diary.text !== '' && hover"
    class="diary-content">
    {{ diary.text }}
  </div>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DayDiary } from '@/store'

export default Vue.extend({
  props: {
    dayOfTheWeek: Number,
    weekOfTheMonth: Number,
    margin: Number,
    diary: Object as PropType<DayDiary | undefined>
  },
  data () {
    return {
      hover: false
    }
  },
  computed: {
    status () {
      const diary = this.diary
      return diary ? diary.dayType.name : undefined
    },
    position (): { [index: string]: string } {
      // @TODO: js involve하지 말고 좌표를 class로 주는게 좋을듯.
      // @TODO: 아예 레이아웃 CSS 아키텍처를 전체적으로 고민할 필요가 있어보임.
      return {
        top: `calc(${2 * (this.weekOfTheMonth as number)}rem + ${(this.margin as number) * (this.weekOfTheMonth as number)}px)`,
        left: `calc(${2 * (this.dayOfTheWeek as number)}rem + ${(this.margin as number) * (this.dayOfTheWeek as number)}px)`
      }
    }
  }
})
</script>

<style lang="scss" scoped>
$day-size: 2rem;
$day-border-radius: 0.375rem;
$day-hover-border: 0.125rem;
$diary-size: 0.5rem;
$diary-margin: ($day-size - $diary-size) / 2;

$training: lighten(#FF9AA2, 12%); // Light Salmon Pink
$workday: lighten(#FFB7B2, 11%); // Melon
$dayoff: lighten(#FFDAC1, 9%); // Very Pale Orange
$pass: lighten(#E2F0CB, 5%); // Dirty White
$leave: lighten(#B5EAD7, 5%); // Magic Mint
$civilian: lighten(#C7CEEA, 7%); // Periwinkle

.day {
  height: $day-size;
  width: $day-size;
  background-color: whitesmoke;
  border-radius: $day-border-radius;
  cursor: pointer;

  position: absolute;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border: $day-hover-border solid #dbdbdb;
    background-color: #efefef;
  }

  &.bootcamp, &.kta, &.staff-duty {
    background-color: $training;
    &:hover {
      border: $day-hover-border solid darken($training, 5%);
      background-color: darken($training, 4%);
    }
    .diary {
      background-color: darken($training, 10%);
    }
  }

  &.workday {
    background-color: $workday;
    &:hover {
      border: $day-hover-border solid darken($workday, 6%);
      background-color: darken($workday, 3%);
    }
    .diary {
      background-color: darken($workday, 10%);
    }
  }

  &.dayoff {
    background-color: $dayoff;
    &:hover {
      border: $day-hover-border solid darken($dayoff, 7%);
      background-color: darken($dayoff, 5%);
    }
    .diary {
      background-color: darken($dayoff, 10%);
    }
  }

  &.pass {
    background-color: $pass;
    &:hover {
      border: $day-hover-border solid darken($pass, 8%);
      background-color: darken($pass, 5%);
    }
    .diary {
      background-color: darken($pass, 12%);
    }
  }

  &.leave {
    background-color: $leave;
    &:hover {
      border: $day-hover-border solid darken($leave, 5%);
      background-color: darken($leave, 4%);
    }
    .diary {
      background-color: darken($leave, 10%);
    }
  }

  &.civilian {
    background-color: $civilian;
    &:hover {
      border: $day-hover-border solid darken($civilian, 6%);
      background-color: darken($civilian, 4%);
    }
    .diary {
      background-color: darken($civilian, 10%);
    }
  }

  .diary {
    height: $diary-size;
    width: $diary-size;
    border-radius: 50%;
    background-color: #dbdbdb;
  }

  .diary-content {
    position: absolute;
    left: calc(100% + 6px);
    top: -2px;
    width: 20rem;
    z-index: 2;
    transform: translateZ(1px);

    border: 1px solid whitesmoke;
    border-radius: 0.25rem;
    padding: 1rem 2rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.12);
    background-color: white;

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #363636;
    line-height: 1.6;
  }
}
</style>
