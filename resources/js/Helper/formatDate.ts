import { format } from "date-fns"
import { isString } from "lodash"


export const formatDate = (date: number | Date | string, pattern = 'dd/MM/y') => {
    return format(isString(date) ? new Date(date) : date, pattern)
}
