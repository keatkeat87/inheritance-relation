export function generateCalendarDates(data: { year: number, month: number, startDay: number }): Date[] {
    // 通过 month year 制造出 42 格子的 table calendar
    const { year, month, startDay } = data;
    const firstDate = new Date(year, month, 1);
    const firstDay = firstDate.getDay();
    const gap = firstDay - startDay; // 知道要向左多少天
    const startDate = firstDate.addDays(-gap);

    const dates = [] as Date[];
    const loopDate = startDate.addDays(-1); //先减一天, 待会每一次 loop 就 add 1 day
    //6 tr 7 td 固定格式
    for (let i = 0; i < 6; i++) {
        for (let i = 0; i < 7; i++) {
            dates.push(loopDate.addDays(1));
        }
    }
    return dates;
}