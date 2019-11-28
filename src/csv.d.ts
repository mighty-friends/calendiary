declare module '*.csv' {
  // export type Status = "civilian" | "bootcamp" | "kta" | "workday" | "pass" | "leave"
  export type Status = string

  interface RawDay {
    date: string;
    status: Status;
    diary: string,
    __parsed_extra: string[]
  }
  
  export interface Day {
    date: string;
    status: Status;
    diary: string
  }
  
  const value: RawDay[]
  export default value
}
