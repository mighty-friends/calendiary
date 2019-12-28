/// 책임: sqlite의 데이터를 type-rich하게 여기서 변환하자
/// 이 레벨에선 아직 primitive한 데이터까지만

import sqlite, { Database } from 'sqlite'

const isDevelopment = process.env.NODE_ENV !== 'production'

export async function init(): Promise<Database> {
  // @TODO: build 환경에서도 접근 가능한 path 찾기
  const db = await sqlite.open('./model.calendiary')

  return db.migrate({
    force: isDevelopment ? 'last' : undefined,
    migrationsPath: 'src/model/migrations/'
  })
}

export interface Duration { startDate: number, endDate: number }

export async function getDuration(db: Database): Promise<Duration> {
  const dates = await Promise.all([
    db.get('SELECT value FROM Settings WHERE key = $key', { $key: 'startDate' }),
    db.get('SELECT value FROM Settings WHERE key = $key', { $key: 'endDate' })
  ])

  const [startDate, endDate] = dates
    .map(date => date.value)
    .map(Number)

  return { startDate, endDate }
}


export interface DayType {
  id: number,
  name: string,
  color: string
}

export function getDayTypes(db: Database): Promise<DayType[]> {
  return db.all('SELECT * FROM DayType')
}


export interface Diary {
  id: number,
  date: number,
  dayType: number,
  text: string
}

export function getDiaries(db: Database): Promise<Diary[]> {
  return db.all('SELECT * FROM Diary')
}
