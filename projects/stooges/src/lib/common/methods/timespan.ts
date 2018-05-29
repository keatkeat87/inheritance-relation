
function second(number: number): number {
    return number * 1000;
}
function minute(number: number): number {
    return second(number * 60);
}
function hour(number: number): number {
    return minute(number * 60);
}
function day(number: number): number {
    return hour(number * 24);
}
function year(number: number): number {
    return day(number * 365);
}

export let timespan = {
    second,
    minute,
    hour,
    day,
    year
};