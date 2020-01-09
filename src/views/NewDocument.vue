<template>
  <div class="draggable">
    <div class="vstack">
      <div class="top-bar"></div>
      <div class="title">새 달력일기</div>
      <div class="field is-name">
        <div class="label">이름:</div>
        <div class="input"><input type="text"></div>
      </div>

      <div class="field is-start-date">
        <div class="label">시작일:</div>
        <div class="input"><input type="date"></div>
      </div>
      <div class="field is-end-date">
        <div class="label">종료일:</div>
        <div class="input"><input type="date"></div>
      </div>

      <div class="field is-colors">
        <div class="label">색:</div>
        <div class="input"></div>
      </div>
    </div>
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

  .vstack {
    height: 500px;
    width: 360px;
    color: var(--body-color);
    background-color: var(--body-background);

    .top-bar {
      height: 38px;
    }

    .title {
      padding: 0 12px;
      margin-bottom: 24px;

      font-size: 22px;
    }

    .field {
      display: flex;
      font-size: 13px;

      .label {
        width: 120px;
        padding: 7px 12px 7px 0;
        text-align: right;
      }

      .input {
        padding: 3px 0;

        input {
          padding: 3px 6px;
          height: 24px;
          width: 160px;

          // @TODO: prefers-color-scheme App.vue로 빼기
          outline: none;
          border-radius: 4px;

          @media (prefers-color-scheme: light) {
            border: 1px solid rgb(206, 206, 206);
          }
          @media (prefers-color-scheme: dark) {
            border: none;
            border-top: 1px solid rgb(66, 66, 66);
            border-bottom: 1px solid rgb(85, 85, 85);
          }

          @media (prefers-color-scheme: light) {
            background-color: white;
          }
          @media (prefers-color-scheme: dark) {
            background-color: rgb(71, 71, 71);
          }
          color: var(--body-color);

          font-size: 13px;

          &[type=date] {
            font-family: "SF Mono", Monaco, monospace;
          }
        }
      }
      &.is-name, &.is-end-date {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
