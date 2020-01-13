<template>
  <div class="draggable">
    <div class="vstack">
      <div class="top-bar">새 달력일기</div>
      <div class="field is-name">
        <div class="label">이름:</div>
        <div class="input"><input v-model="name" type="text"></div>
      </div>

      <div class="field is-start-date">
        <div class="label">시작일:</div>
        <div class="input"><input v-model="startDate" type="date"></div>
      </div>
      <div class="field is-end-date">
        <div class="label">종료일:</div>
        <div class="input"><input v-model="endDate" type="date"></div>
      </div>

      <div class="field is-colors">
        <div class="label">색:</div>
        <div class="input" style="padding: 7px 0">WIP</div>
      </div>

      <div class="field is-save">
        <button>취소</button>
        <button @click="save()">확인</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { remote, ipcRenderer } from 'electron'

export default Vue.extend({
  data () {
    return {
      name: '',
      startDate: undefined,
      endDate: undefined
    }
  },
  methods: {
    async save () {
      const result = await ipcRenderer.invoke('save-document', {
        name: this.name,
        startDate: this.startDate,
        endDate: this.endDate
      })
      console.log(result)
    }
  }
})
</script>

<style lang="scss" scoped>
.draggable {
  -webkit-app-region: drag;
  -webkit-user-select: none;

  .vstack {
    height: 400px;
    width: 360px;
    color: var(--body-color);
    background-color: var(--body-background);

    .top-bar {
      height: 22px;
      font-size: 13px;
      padding: 3px 0 6px 0;
      margin-bottom: 50px;
      text-align: center;
      // border-bottom: 1px solid rgb(72, 72, 72);
    }

    .field {
      display: flex;
      font-size: 13px;

      &.is-name, &.is-end-date, &.is-colors {
        margin-bottom: 12px;
      }

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

      &.is-save {
        position: absolute;
        bottom: 0;
        right: 0;
        justify-content: flex-end;
        padding: 13px;

        button {
          // @TODO: button 컴퍼넌트로 빼던가.. 뭔가 이 스타일 공유할 방법을 찾자
          font-size: 13px;
          border: 1px solid #414141;
          border-radius: 4px;
          padding: 2px 13px;
          margin-left: 7px;
          outline: none;
          color: var(--body-color);
          background: #626262;
          &:hover {
            background: #525252;
          }
          &:focus {
            background: #323232;
          }
        }
      }
    }
  }
}
</style>
