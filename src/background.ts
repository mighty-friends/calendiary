export interface DayType {
  id: number,
  name: string,
  /// Hex color such as '#363636'
  color: string
}

export interface Day {
  id: number,
  /// id of the DayType
  dayTypeId: number,
  text: string
}

export interface Calendiary {
  name: string,
  /// Unix date, i.e., Unix time / 86400
  startDate: number,
  endDate: number,
  dayTypes: DayType[],
  days: (Day | undefined)[]
}

export interface CalendiaryConnection {
  getCalendiary: () => Promise<Calendiary>,
  closeCalendiary: () => Promise<void>,
  updateName: (newName: string) => Promise<void>,
  updateStartDate: (newDate: number) => Promise<void>,
  updateEndDate: (newDate: number) => Promise<void>,
  addDayType: (newDayType: { name: string, color: string }) => Promise<{ id: number }>,
  updateDayType: (id: number, newDayType: { name: string, color: string }) => Promise<void>,
  deleteDayType: (id: number) => Promise<{ ok: boolean }>,
  updateDay: (newDay: { dayTypeId: number, text: string }) => Promise<void>
}

export interface Model {
  calendiaries: CalendiaryConnection[],
  // @TODO: config typing
  initCalendiary: (path: string, config: any) => Promise<CalendiaryConnection>,
  loadCalendiary: (path: string) => Promise<CalendiaryConnection>,
  closeCalendiary: (connection: CalendiaryConnection) => Promise<void>
}

export { model } from './background/model'
import './background/app-state'
