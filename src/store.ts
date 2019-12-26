import Vue from 'vue'
import Vuex from 'vuex'
import { ipcRenderer } from 'electron'

Vue.use(Vuex)

function range (n: number): number[] {
  return [...Array(n).keys()]
}

function pad (n: number): string {
  return (n > 9) ? String(n) : ('0' + n)
}

/// Days getter에 들어갈 primitive data들을 join한 타입들: Day, Month.
/// Container component에 한번에 넘겨줄 물건
// @TODO: 앱 전체의 기초가 될 타입들에 대해 좀 더 고민이 있었으면 좋겠음
// @TODO: Vuex 아키텍처도 좀만 더 고민해보자
export interface DayDiary {
  id: number,
  date: string,
  dayType: DayType,
  text: string
}

export interface MonthDiary {
  year: number,
  month: number,
  startingDayOfTheWeek: number,
  days: (DayDiary | undefined)[]
}

/// Make an month-indexed days
function monthDiaries (startDate: string, endDate: string, diaries: Diary[], dayTypes: DayType[]): MonthDiary[] {
  const start: Date = new Date(startDate),
    end: Date = new Date(endDate),
    startYear = start.getUTCFullYear(),
    endYear = end.getUTCFullYear(),
    yearDiff = endYear - startYear,
    startMonth = start.getUTCMonth(),
    endMonth = end.getUTCMonth(),
    monthDiff = endMonth - startMonth,
    numberOfMonthsBetweenPeriod = yearDiff * 12 + monthDiff + 1 // closed interval

  return range(numberOfMonthsBetweenPeriod).map(monthOffset => {
    const year = startYear + Math.floor((startMonth + monthOffset) / 12),
      month = (startMonth + monthOffset) % 12 + 1,
      startingDayOfTheWeek = new Date(`${year}-${pad(month)}-01`).getDay(),
      // @TODO: 여기서 startDate 이전이랑 endDate 이후는 별도 처리해야할듯..
      // field 하나 더 만드는게 좋을지도. isWithinInterval 같은 이름? ui는 회색처리하면 될듯
      daysCount = new Date(year, month, 0).getDate(),
      days = range(daysCount)
        .map(day => `${year}-${pad(month)}-${pad(day + 1)}`)
        .map(date => diaries.find(diary => diary.date === date))
        .map(day => {
          return day ? {
            id: day.id,
            date: day.date,
            dayType: dayTypes.find(dayType => dayType.id === day.dayType)!,
            text: day.text
          } : undefined
        })

    return { year, month, startingDayOfTheWeek, days }
  })
}

function unixDateToIsoDate (unixDate: number): string {
  const date = new Date(unixDate * 86400 * 1000)
  return date.toISOString().slice(0, 10)
}

// @TODO: interface model.ts랑 공유하기
/// Primitive Diary type.
interface Diary {
  id: number,
  date: string,
  dayType: number,
  text: string
}

/// Primitive DayType type.
interface DayType {
  id: number
  name: string,
  color: string
}

/// Vuex state의 타입. Primitive type들만 들어갈 수 있음.
interface State {
  utcStartDate: number | null,
  utcEndDate: number | null,
  dayTypes: DayType[],
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
    },
    /// Month-indexed days
    monthDiaries ({ diaries, dayTypes }, { startDate, endDate }) {
      return monthDiaries(startDate, endDate, diaries, dayTypes)
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
        // date를 number에서 string으로 바꾸기 위한 더러운 type definition..
        .map((diary: { date: number }) => ({
          ...diary,
          date: unixDateToIsoDate(diary.date)
        }))
    }
  },
  actions: {
    async load ({ commit }) {
      // @TODO: web에서도 작동하도록 만들 수 있을까..?
      const { duration, dayTypes, diaries } = await ipcRenderer.invoke('load')

      commit('setDuration', duration)
      commit('setDayTypes', dayTypes)
      commit('setDiaries', diaries)
    }
  }
})
