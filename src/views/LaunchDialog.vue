<template>
  <div class="draggable">
    <div class="hstack">
      <div class="left">
        <div class="logo">
          <!-- <img src="" alt="로고"> -->
        </div>
        <div class="app-name">
          Calendiary
        </div>
        <div class="version">
          {{ version }}
        </div>
      </div>
      <div class="right">
        <ul class="buttons">
          <li class="button">새 캘린터</li>
          <li @click="openFile" class="button">열기...</li>
          <!-- <li class="button">«파일 이름» 다시 열기</li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { remote, ipcRenderer } from 'electron'

export default Vue.extend({
  computed: {
    version () {
      return remote.app.getVersion()
    }
  },
  methods: {
    openFile () {
      ipcRenderer.invoke('open-file')
    }
  }
})
</script>

<style lang="scss" scoped>
.draggable {
  -webkit-app-region: drag;
  -webkit-user-select: none;
}

.hstack {
  display: flex;
  color: var(--body-color);

  .left {
    width: 200px;
    height: 400px;
    text-align: center;

    background-color: var(--body-background);

    .logo {
      margin: 40px auto 20px;
      height: 120px;
      width: 120px;
      border-radius: 60px;
      background-color: #333;
      @media (prefers-color-scheme: light) {
        background-color: whitesmoke;
      }
    }

    .app-name {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 6px;
    }
  }

  .right {
    width: 450px;
    height: 400px;
    .buttons {
      width: 100%;
      padding: 30px 28px;
      .button {
        font-size: 13px;
        padding: 6px 8px;
        border-radius: 5px;

        &:hover {
          background-color: rgba(48, 48, 48, 0.7);
        }
      }
    }
  }
}
</style>
