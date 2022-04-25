import { differenceInDays } from "date-fns";
import { parseDate } from "./parseDate";

/**
 * @param {string} dateLeft
 * @param {string} dateRight
 * @returns {number | null}
 */
export const diffInDays = (dateLeft: string, dateRight: string) => {
    const a = parseDate(dateLeft);
    const b = parseDate(dateRight);

    if (a && b) return Math.abs(differenceInDays(a, b));

    return null;
};
