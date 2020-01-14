import sqlite, { Database } from 'sqlite'

import { Model, CalendiaryConnection, Calendiary, Day } from '@/background'

const INIT_TABLES = `
CREATE TABLE DayType
(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
color TEXT
);

CREATE TABLE Day
(
id INTEGER PRIMARY KEY AUTOINCREMENT,
date INTEGER NOT NULL UNIQUE,
dayType INTEGER REFERENCES DayType (id) ON DELETE RESTRICT,
text TEXT
);

CREATE TABLE Settings
(
id INTEGER PRIMARY KEY AUTOINCREMENT,
"key" TEXT NOT NULL UNIQUE,
value TEXT NOT NULL UNIQUE
);
`

const INSERT_DAY_TYPE = `
INSERT INTO DayType (name, color) VALUES ($name, $color);
`

const INSERT_DAY = `
INSERT INTO Day (date, dayType, text) VALUES ($date, $dayType, $text);
`

const INSERT_SETTINGS = `
INSERT INTO Settings (key, value) VALUES ($key, $value);
`

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

    // @TODO: 이미 그 path에 파일이 있을 경우에 문제 생기는 듯
    await database.exec(INIT_TABLES)

    await Promise.all([
      database.run(INSERT_SETTINGS, { $key: 'startDate', $value: config.startDate }),
      database.run(INSERT_SETTINGS, { $key: 'endDate', $value: config.endDate }),
      database.run(INSERT_SETTINGS, { $key: 'nameOfCalendar', $value: config.name })
    ])

    await database.run(INSERT_DAY_TYPE, { $name: '당직', $color: 'FFA4AB' })
    await database.run(INSERT_DAY_TYPE, { $name: '훈련소', $color: 'FFD7DA' })
    await database.run(INSERT_DAY_TYPE, { $name: '평일', $color: 'FFEBEA' })
    await database.run(INSERT_DAY_TYPE, { $name: '외박', $color: 'EDF6DF' })
    await database.run(INSERT_DAY_TYPE, { $name: '휴가', $color: 'C9F0E2' })

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
