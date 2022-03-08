import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// val LOCAL_DATE_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
// val LOCAL_DATE_TIME_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")

export const dayFormat = (date, format = 'YYYY.MM.DD HH:mm') => {
    return date ? dayjs(date).format(format) : ''
}

export const localDate = (date) => {
    return dayFormat(date, 'YYYY-MM-DD')
}

export const localDateTime = (date) => {
    return dayFormat(date, 'YYYY-MM-DD HH:mm:ss')
}

export default dayjs
