export const getRoomType = (capacity: number) =>
({
    1: "single",
    2: "double",
    3: "triple",
    4: "quadruple",
}[capacity]);
