import dayjs from 'dayjs'

/** 格式化时间 */
export const formatDateTime = (time: any) => {
  if (time == null || time === '') {
    return 'N/A'
  }
  const date = new Date(time)
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

export function formatDate(dateString:any) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 月份是从0开始的
  const day = date.getDate()
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}
