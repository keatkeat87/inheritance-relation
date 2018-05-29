export function typeOf(value: any): 'array' | 'object' | 'number' | 'string' | 'null' | 'boolean' | 'undefined' | 'date' | 'function' {
    // 取代 default 的 typyoF    
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}