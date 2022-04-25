import { format } from "date-fns"
import { isString } from "lodash"
import { parseDate } from "./parseDate"


export const formatDate = (date: number | Date | string, pattern = 'dd/MM/y') => {
    return format(isString(date) ? parseDate(date) : date, pattern)
}
