import { parse } from "date-fns/esm";

/**
 * Attempt to convert a string to a valid Date object.
 *
 * @param {string} value
 * @returns {Date}
 */
export const parseDate = (dateString: string) => {
    // Remove tz part
    if (dateString.includes("T")) dateString = dateString.split("T")[0];

    return parse(dateString, "y-MM-dd", new Date());
};
