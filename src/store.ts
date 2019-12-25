import Vue from 'vue'
import Vuex from 'vuex'
import { ipcRenderer } from 'electron'

Vue.use(Vuex)

function unixDateToIsoDate (unixDate: number): string {
  const date = new Date(unixDate * 86400 * 1000)
  return date.toISOString().slice(0, 10)
}

// @TODO: interface model.ts랑 공유하기
interface Diary {
  id: number,
  date: number,
  dayType: number,
  text: string
}

interface State {
  utcStartDate: number | null,
  utcEndDate: number | null,
  dayTypes: {
    id: number
    name: string,
    color: string
  }[],
  diaries: Diary[]
}

export default new Vuex.Store({
  state: {
    utcStartDate: null,
    utcEndDate: null,
    dayTypes: [],
    diaries: []
  } as State,
  getters: {
    startDate ({ utcStartDate }) {
      return utcStartDate ? unixDateToIsoDate(utcStartDate) : null
    },
    endDate ({ utcEndDate }) {
      return utcEndDate ? unixDateToIsoDate(utcEndDate) : null
    }
  },
  mutations: {
    setDuration (state, duration) {
      state.utcStartDate = duration.startDate
      state.utcEndDate = duration.endDate
    },
    setDayTypes (state, dayTypes) {
      state.dayTypes = dayTypes
    },
    setDiaries (state, diaries) {
      state.diaries = diaries
        .map((diary: Diary) => ({
          ...diary,
          date: unixDateToIsoDate(diary.date)
        }))
    }
  },
  actions: {
    async getDuration ({ commit }) {
      commit('setDuration', await ipcRenderer.invoke('getDuration'))
    },
    async getDayTypes ({ commit }) {
      commit('setDayTypes', await ipcRenderer.invoke('getDayTypes'))
    },
    async getDiaries ({ commit }) {
      commit('setDiaries', await ipcRenderer.invoke('getDiaries'))
    }
  }
})
