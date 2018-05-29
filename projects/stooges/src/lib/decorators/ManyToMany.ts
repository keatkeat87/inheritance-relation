export function ManyToMany() {
    // 用于 build form, 一定要是单纯的 n-n 而不是那种有 1-n + n-1 d
    // 用 multiple select 来做 accessor
    return Reflect.metadata('ManyToMany', null);
}