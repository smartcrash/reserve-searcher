import { isValid, addDays } from "date-fns";

/**
 * Attempt to convert a string to a valid Date object.
 *
 * @param {string | null} value
 * @returns {Date | undefined}
 */
export const parseDate = (value: string | null) => {
    if (!value) return undefined;

    const date = new Date(value);

    if (!isValid(date)) return undefined;

    return addDays(date, 1);
};
