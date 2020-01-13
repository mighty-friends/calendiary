import sqlite, { Database } from 'sqlite'

import { Model, CalendiaryConnection, Calendiary, Day } from '@/background'

declare const __static: string

const isDevelopment = process.env.NODE_ENV !== 'production'

function range (n: number): number[] {
  return [...Array(n).keys()]
}

function createConnection (database: Database): CalendiaryConnection {
  return {
    async getCalendiary (): Promise<Calendiary> {
      const [
        startDate, endDate, dayTypes, name, rawDays
      ]: [
        number,
        number,
        { id: number, name: string, color: string }[],
        string,
        { id: number, date: number, dayType: number, text: string }[]
      ] = await Promise.all([
        database.get('SELECT value FROM Settings WHERE key = "startDate"')
          .then(date => Number(date.value)),
        database.get('SELECT value FROM Settings WHERE key = "endDate"')
          .then(date => Number(date.value)),
        database.all('SELECT * FROM DayType'),
        database.get('SELECT value FROM Settings WHERE key = "nameOfCalendar"')
          .then(name => name.value),
        database.all('SELECT * FROM Day')
      ])

      const days: (Day | undefined)[] = range(endDate - startDate + 1)
        .map(_ => undefined)

      rawDays.forEach(({ id, date, dayType: dayTypeId, text}) => {
        days[date - startDate] = { id, dayTypeId, text }
      })

      return {
        name, startDate, endDate, dayTypes, days
      }
    },
    async closeCalendiary (): Promise<void> {
      database.close()
    },
    async updateName (): Promise<void> { /* IMPL HERE */ },
    async updateStartDate (): Promise<void> { /* IMPL HERE */ },
    async updateEndDate (): Promise<void> { /* IMPL HERE */ },
    async addDayType (): Promise<{ id: number }> { /* IMPL HERE */ return { id: 1 } },
    async updateDayType (): Promise<void> { /* IMPL HERE */ },
    async deleteDayType (): Promise<{ ok: boolean }> { /* IMPL HERE */ return { ok: true } },
    async updateDay (): Promise<void> { /* IMPL HERE */ }
  }
}

export const model: Model = {
  calendiaries: [],

  async initCalendiary (path: string, config: any): Promise<CalendiaryConnection> {
    const database = await sqlite.open(path)

    // @TODO: config를 활용해서 init
    database.migrate({
      force: isDevelopment ? 'last' : undefined,
      migrationsPath: __static + '/migrations/'
    })

    return createConnection(database)
  },

  async loadCalendiary (path: string): Promise<CalendiaryConnection> {
    const database = await sqlite.open(path)
    return createConnection(database)
  },

  async closeCalendiary (connection: CalendiaryConnection): Promise<void> {
    return connection.closeCalendiary()
  }
}
