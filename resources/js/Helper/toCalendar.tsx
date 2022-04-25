import { formatDate } from "./formatDate";

/**
 * Formats the given date using the pattern: Y-m-d. complatible with HTML date inputs.
 *
 * @param {Date} date - Date to format
 * @returns {string}
 */
export const toCalendar = (date: Date) => formatDate(date, "y-MM-dd");
