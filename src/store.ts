import Vue from 'vue'
import Vuex from 'vuex'
import { ipcRenderer } from 'electron'

import { DayType, Calendiary } from '@/background'

Vue.use(Vuex)

function range (n: number): number[] {
  return [...Array(n).keys()]
}

export function pad (n: number): string {
  return (n > 9) ? String(n) : ('0' + n)
}

export interface Day { id: number, dayTypeId: number, text: string }
export interface Month { offset: number, days: (Day | undefined)[] }
export interface Year { offset: number, months: Month[] }
export interface IndexedDays { offset: number, years: Year[] }

/// Make an month-indexed days
function indexedDays (startDate: string, endDate: string, days: (Day | undefined)[], dayTypes: DayType[]): IndexedDays {
  const start: Date = new Date(startDate),
    end: Date = new Date(endDate),
    startYear = start.getUTCFullYear(),
    endYear = end.getUTCFullYear(),
    yearDiff = endYear - startYear,
    startMonth = start.getUTCMonth(),
    endMonth = end.getUTCMonth(),
    startDay = start.getUTCDate() - 1, // - 1 to make it an offset
    endDay = end.getUTCDate() - 1 // - 1 to make it an offset

  if (!yearDiff) { return { offset: 0, years: [] } }

  return {
    offset: startYear,
    years: range(yearDiff + 1)
      .map(yearOffset =>
        (() => {
          if (yearOffset === 0) {
            return {
              offsetOfTheStartMonth: startMonth,
              monthCountOfTheYear: 12 - startMonth
            }
          } else if (yearOffset === yearDiff) {
            return {
              offsetOfTheStartMonth: 0,
              monthCountOfTheYear: endMonth + 1
            }
          } else {
            return {
              offsetOfTheStartMonth: 0,
              monthCountOfTheYear: 12
            }
          }
        })())
      .map(({ offsetOfTheStartMonth, monthCountOfTheYear }, yearOffset) => ({
        offset: offsetOfTheStartMonth,
        months: range(monthCountOfTheYear)
          .map(offsetFromTheStartMonth =>
            offsetOfTheStartMonth + offsetFromTheStartMonth)
          .map(monthOffset => {
            const dayCountOfTheFullMonth = getDayCountOfTheMonth(startYear + yearOffset, monthOffset)
            const { offsetOfTheStartDay, dayCountOfTheMonth } = (() => {
              if (yearOffset === 0 && monthOffset === startMonth) {
                return {
                  offsetOfTheStartDay: startDay,
                  dayCountOfTheMonth: dayCountOfTheFullMonth - startDay
                }
              } else if (yearOffset === yearDiff && monthOffset === endMonth) {
                return {
                  offsetOfTheStartDay: 0,
                  dayCountOfTheMonth: endDay + 1
                }
              } else {
                return {
                  offsetOfTheStartDay: 0,
                  dayCountOfTheMonth: dayCountOfTheFullMonth
                }
              }
            })()

            return {
              offset: offsetOfTheStartDay,
              days: range(dayCountOfTheMonth)
                .map(offsetFromTheStartDay =>
                  offsetOfTheStartDay + offsetFromTheStartDay)
                .map(dayOffset => {
                  const unixStartDate = isoDateToUnixDate(startDate)
                  const isoDate = `${startYear + yearOffset}-${pad(1 + monthOffset)}-${pad(1 + dayOffset)}`
                  const unixDate = isoDateToUnixDate(isoDate)

                  return days[unixDate - unixStartDate]
                })
            }
          })
      }))
  }
}

function unixDateToIsoDate (unixDate: number): string {
  const date = new Date(unixDate * 86400 * 1000)
  return date.toISOString().slice(0, 10)
}

export function isoDateToUnixDate (isoDate: string): number {
  const date = new Date(isoDate)
  return date.getTime() / 1000 / 86400
}

function getDayCountOfTheMonth (year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

/// Vuex state의 타입. Primitive type들만 들어갈 수 있음.
interface State {
  name: string | undefined,
  unixStartDate: number | undefined,
  unixEndDate: number | undefined,
  dayTypes: DayType[],
  days: (Day | undefined)[],
  selectedDay: { year: number, month: number, day: number } | undefined
}

export default new Vuex.Store({
  state: {
    name: undefined,
    unixStartDate: undefined,
    unixEndDate: undefined,
    dayTypes: [],
    days: [],
    selectedDay: undefined
  } as State,
  getters: {
    startDate ({ unixStartDate }) {
      return unixStartDate ? unixDateToIsoDate(unixStartDate) : undefined
    },
    endDate ({ unixEndDate }) {
      return unixEndDate ? unixDateToIsoDate(unixEndDate) : undefined
    },
    /// Year & Month-indexed days
    indexedDays ({ days, dayTypes }, { startDate, endDate }) {
      return indexedDays(startDate, endDate, days, dayTypes)
    },
    getDayBy: ({ unixStartDate, days }) =>
      ({ year, month, day }: { year: number, month: number, day: number }): (Day | undefined) => {
        const unixDate = isoDateToUnixDate(`${year}-${pad(month + 1)}-${pad(day + 1)}`)
        return unixStartDate ? days[unixDate - unixStartDate] : undefined
      },
    getDayTypeById: ({ dayTypes }) =>
      (id: number): DayType => {
        return dayTypes.find(dayType => dayType.id === id)!
      }
  },
  mutations: {
    selectDay (state, { year, month, day }) {
      state.selectedDay = { year, month, day }
    },
    clearSelectedDay (state) {
      state.selectedDay = undefined
    },
    setName (state, name) {
      state.name = name
    },
    setUnixStartDate (state, startDate) {
      state.unixStartDate = startDate
    },
    setUnixEndDate (state, endDate) {
      state.unixEndDate = endDate
    },
    setDayTypes (state, dayTypes) {
      state.dayTypes = dayTypes
    },
    setDays (state, days) {
      state.days = days
    },
    updateDayTypeOfDay (state, { offsetFromStartDate, dayTypeId }) {
      state.days = state.days.map((day: Day | undefined, i: number) => {
        if (i === offsetFromStartDate) {
          // 이 메소드는 "이미 존재하는 Day를 업데이트"하기 위함.
          // 따라서 day가 undefined면 문제가 있다.
          // @TODO: 난 null쓴 적이 없는데 null이 저장돼있음.. 고쳐지면 === 로 바꾸자
          if (day === undefined || day === null) {
            console.error('Update dayType of un-initialized day.')
            return undefined
          }
          return { ...day, dayTypeId }
        } else { return day }
      })
    }
  },
  actions: {
    async load ({ commit }) {
      const { name, startDate, endDate, dayTypes, days }: Calendiary = await ipcRenderer.invoke('load-document')

      commit('setName', name)
      commit('setUnixStartDate', startDate)
      commit('setUnixEndDate', endDate)
      commit('setDayTypes', dayTypes)
      commit('setDays', days)
    },
    async setDayType ({ commit }, { offsetFromStartDate, dayTypeId }) {
      // @TODO: 아래 주석 다!
      if (/* 이미 있으면 */isNaN(NaN)) {
        // update SQL file
        // 성공시
        commit('updateDayTypeOfDay', { offsetFromStartDate, dayTypeId })
        // 실패시
        // console.error('file 쓰기 실패')
      } else { // 이 offset의 값이 undefined라면
        // sql에 이 dayTypeId랑 '' text로 CREATE INTO day를 invoke
        // 성공시
        // commit('createDay', Day)
        // 실패시
        // console.error('Fail to create new Day')
      }
      // ?? 이 함수의 결과값의 범위를 잘 고민해봐야할듯..
      // 현재 추측: return Ok( SOME(원래값) | NONE ) | Err
    }
  }
})
