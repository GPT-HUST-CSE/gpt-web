import dayjs from 'dayjs'

export function formatMonthDay(date: any, formatStr = "MM月DD日") {
  return dayjs(date).format(formatStr)
}

export function getDiffDays(startDate: any, endDate: any) {
  return dayjs(endDate).diff(startDate, "day")
}
