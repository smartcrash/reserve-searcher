import { CURRENCY } from "../constants";

export const toCurrency = (amount: number) =>
    new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: CURRENCY,
    }).format(amount);
