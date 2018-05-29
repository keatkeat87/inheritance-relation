
import 'reflect-metadata';
import { CompareWith } from './types';
import { getByPath, isDate } from './common';

declare global {
    interface Date {
        addMilliseconds(num: number): Date;
        addSeconds(num: number): Date;
        addMinutes(num: number): Date;
        addHours(num: number): Date;
        addDays(num: number): Date;
        addWeeks(num: number): Date;
        addMonths(num: number): Date;
        addYears(num: number): Date;
        todayStart(): Date;
        thisMonthStart(): Date;
        todayEnd(): Date;
        getTimezoneString(): string;
        toDatetimeOffSetString(): string;
        toDateString(): string;
    }
    interface Array<T> {
        singleOrDefault(filter?: (item: T) => boolean): T | undefined;
        groupBy(compareWith?: CompareWith<T>): T[][];
        orderBy(paths: string[], needClone?: boolean, convertValue?: (path: string, value: any) => any): T[];
        sum(getNumberFn?: (item: T) => number): number;
        max(getNumberFn?: (item: T) => number): number;
        remove(filter?: (item: T) => boolean): T[];
        remove(item: T): T[];
        distinct(compare?: (a: T, b: T) => boolean): T[]
    }
    interface String {
        padStart(maxLength: number, fillString: string): string;
        padEnd(maxLength: number, fillString: string): string;
        firstCharUpperCase(): string;
        clearSpace(): string;
        lowerCaseEqual(compareValue: string): boolean;
        lowerCaseIndexOf(searchString: string, position?: number): number;
    }
}



export function setupExtension() {

    const RequireObjectCoercible = (O: any) => {
        if (O === null || typeof O === 'undefined') {
            throw new TypeError(`"this" value must not be null or undefined`);
        }
        return O;
    };
    const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
    const ToLength = (argument: any) => {
        const len = Number(argument);
        if (Number.isNaN(len) || len <= 0) { return 0; }
        if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
        return len;
    };
    String.prototype.padStart = function padStart(maxLength: number, fillString = ' ') {
        const O = RequireObjectCoercible(this);
        const S = String(O);
        const intMaxLength = ToLength(maxLength);
        const stringLength = ToLength(S.length);
        if (intMaxLength <= stringLength) { return S; }
        let filler = typeof fillString === 'undefined' ? ' ' : String(fillString);
        if (filler === '') { return S; }
        const fillLen = intMaxLength - stringLength;
        while (filler.length < fillLen) {
            const fLen = filler.length;
            const remainingCodeUnits = fillLen - fLen;
            if (fLen > remainingCodeUnits) {
                filler += filler.slice(0, remainingCodeUnits);
            } else {
                filler += filler;
            }
        }
        const truncatedStringFiller = filler.slice(0, fillLen);
        return truncatedStringFiller + S;
    };

    String.prototype.padEnd = function padEnd(maxLength: number, fillString = ' ') {
        const O = RequireObjectCoercible(this);
        const S = String(O);
        const intMaxLength = ToLength(maxLength);
        const stringLength = ToLength(S.length);
        if (intMaxLength <= stringLength) { return S; }
        let filler = typeof fillString === 'undefined' ? ' ' : String(fillString);
        if (filler === '') { return S; }
        const fillLen = intMaxLength - stringLength;
        while (filler.length < fillLen) {
            const fLen = filler.length;
            const remainingCodeUnits = fillLen - fLen;
            if (fLen > remainingCodeUnits) {
                filler += filler.slice(0, remainingCodeUnits);
            } else {
                filler += filler;
            }
        }
        const truncatedStringFiller = filler.slice(0, fillLen);
        return S + truncatedStringFiller;
    };

    String.prototype.firstCharUpperCase = function () {
        return (this as string).charAt(0).toUpperCase() + this.substring(1);
    };

    String.prototype.clearSpace = function () {
        return (this as string).replace(/\s+/g, '');
    };

    String.prototype.lowerCaseEqual = function (compareValue: string) {
        return (this as string).toLowerCase() === compareValue.toLowerCase();
    };

    String.prototype.lowerCaseIndexOf = function (searchString: string, position?: number) {
        return (this as string).toLowerCase().indexOf(searchString.toLowerCase(), position);
    };

    Date.prototype.getTimezoneString = function () {
        const timezone = (this.getTimezoneOffset() / 60 * -1).toFixed(2).toString();
        let front = timezone.split('.')[0];
        let frontNumber = +front;
        if (frontNumber < 0) {
            frontNumber = frontNumber * -1;
            front = '-' + frontNumber.toString().padStart(2, '0');
        }
        else {
            front = '+' + front.padStart(2, '0');
        }
        let end = timezone.split('.')[1];
        const endNumber = (+end) / 10 * 6;
        if (endNumber == 0) end = '00';
        return front + ':' + end;
    };
    Date.prototype.toDatetimeOffSetString = function () {
        const that = this as Date;
        //to : 2014-11-28T09:08:13.0000000+03:00
        //project
        return that.getFullYear() + '-' +
            (that.getMonth() + 1).toString().padStart(2, '0') + '-' +
            that.getDate().toString().padStart(2, '0') + 'T' +
            that.getHours().toString().padStart(2, '0') + ':' +
            that.getMinutes().toString().padStart(2, '0') + ':' +
            that.getSeconds().toString().padStart(2, '0') + '.' +
            that.getMilliseconds().toString().padStart(3, '0') +
            that.getTimezoneString();
    };

    Date.prototype.toDateString = function () {
        const date = this as Date;
        const yearStr = date.getFullYear();
        const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
        const dateStr = date.getDate().toString().padStart(2, '0');
        return `${yearStr}-${monthStr}-${dateStr}`;
    };

    Date.prototype.thisMonthStart = function () {
        let date = new Date(this);
        date.setDate(1);
        date = date.todayStart();
        return date;
    };
    Date.prototype.todayStart = function () {
        let date = new Date(this);
        date.setHours(0, 0, 0, 0);
        return date;
    };
    Date.prototype.todayEnd = function () {
        let date = new Date(this);
        date.setHours(23, 59, 59, 999);
        return date;
    };
    Date.prototype.addMilliseconds = function (num: number) {
        let date = new Date(this);
        const methodName = 'Milliseconds';
        date['set' + methodName](date['get' + methodName]() + num); //用default的set功能(它会智能处理进位的)
        return date;
    };
    Date.prototype.addSeconds = function (num: number) {
        let date = new Date(this);
        const methodName = 'Seconds';
        date['set' + methodName](date['get' + methodName]() + num); //用default的set功能(它会智能处理进位的)
        return date;
    };
    Date.prototype.addMinutes = function (num: number) {
        let date = new Date(this);
        const methodName = 'Minutes';
        date['set' + methodName](date['get' + methodName]() + num); //用default的set功能(它会智能处理进位的)
        return date;
    };
    Date.prototype.addHours = function (num: number) {
        let date = new Date(this);
        const methodName = 'Hours';
        date['set' + methodName](date['get' + methodName]() + num); //用default的set功能(它会智能处理进位的)
        return date;
    };
    Date.prototype.addDays = function (num: number) {
        let date = new Date(this);
        const methodName = 'Date';
        date['set' + methodName](date['get' + methodName]() + num); //用default的set功能(它会智能处理进位的)
        return date;
    };
    Date.prototype.addWeeks = function (num: number) {
        num = num * 7;
        return this.addDays(num);
    };
    Date.prototype.addMonths = function (num: number) {
        let date = new Date(this);
        const methodName = 'Month';
        date['set' + methodName](date['get' + methodName]() + num); //用default的set功能(它会智能处理进位的)
        return date;
    };
    Date.prototype.addYears = function (num: number) {
        let date = new Date(this);
        const methodName = 'FullYear';
        date['set' + methodName](date['get' + methodName]() + num); //用default的set功能(它会智能处理进位的)
        return date;
    };


    Array.prototype.singleOrDefault = function (filter = (item: any) => item) {
        const that = this as any[];
        const items = that.filter((item) => {
            return filter(item);
        });
        if (items.length > 1) {
            console.error('singleOrDefault detect 2 items');
        }
        return items[0];
    };


    Array.prototype.groupBy = function (compareWith: CompareWith = (a, b) => a === b) {
        const datas : any[] = [...this];
        const results : any[][] = [];
        while (datas.length > 0) {
            const result : any[] = [];
            const aData = datas.pop()!;
            result.unshift(aData);
            for (let i = datas.length - 1; i >= 0; i--) {
                const bData = datas[i];
                const match = compareWith(aData, bData);
                if (match) {
                    result.unshift(bData);
                    datas.splice(i, 1);
                }
            }
            results.unshift(result);
        }
        return results;
    };

    Array.prototype.sum = function (getNumberFn = (item: any) => item) {
        return (this as any[]).reduce((result, item) => {
            return result += getNumberFn(item);
        }, 0);
    };

    Array.prototype.max = function (getNumberFn = (item: any) => item) {
        return (this as any[]).reduce((result, item) => {
            const num = getNumberFn(item);
            return (result > num) ? result : num;
        }, 0);
    };

    function isSameValue(a: any, b: any) {
        if (a === b) return true;
        if (isDate(a) && isDate(b)) {
            return +a === +b || (isNaN(+a) && isNaN(+b));
        }
    }
    // 简单用法 [].sort((a,b) => sortCompare(a,b,false));
    // 参考 orderBy
    // -1 = a,b
    // 0 same
    // 1 = b,a
    function sortCompare(a: any, b: any, desc = false): -1 | 0 | 1 {
        const asc = !desc;
        if (isSameValue(a, b)) return 0;
        if (asc) {
            if (a == null || b == null) {
                return (b == null) ? -1 : 1;
            }
            if (typeof (a) === 'boolean') {
                return (a === true && b === false) ? -1 : 1;
            }
            else if (typeof (a) === 'number') {
                return (a < b) ? -1 : 1;
            }
            else if (isDate(a)) {
                return (+a < +b) ? -1 : 1;
            }
            else if (typeof (a) === 'string') {
                const isChinese = (a as string).charCodeAt(0) >= 10000;
                const result = (isChinese) ? (a as string).localeCompare(b, 'zh-CN') : (a as string).localeCompare(b);
                return result as -1 | 0 | 1;
            }
            else {
                return '' as never;
            }
        }
        else {
            if (a == null || b == null) {
                return (a == null) ? -1 : 1;
            }
            if (typeof (a) === 'boolean') {
                return (b === true && a === false) ? -1 : 1;
            }
            else if (typeof (a) === 'number') {
                return (b < a) ? -1 : 1;
            }
            else if (isDate(a)) {
                return (+b < +a) ? -1 : 1;
            }
            else if (typeof (a) === 'string') {
                const isChinese = (a as string).charCodeAt(0) >= 10000;
                const result = (isChinese) ? (b as string).localeCompare(a, 'zh-CN') : (b as string).localeCompare(a);
                return result as -1 | 0 | 1;
            }
            else {
                return '' as never;
            }
        }
    }


    Array.prototype.orderBy = function (paths: string[], needClone = true, convertValue = (_path: string, value: string) => value) {
        // js 的 sort 是 void 来的, 但我们不要啦
        const array: any[] = (needClone) ? [...this] : this;
        return array.sort((o1, o2) => {
            for (let path of paths) {
                const desc = path.startsWith('-');
                if (desc) path = path.substring(1);
                const a = convertValue(path, getByPath(o1, path));
                const b = convertValue(path, getByPath(o2, path));
                const result = sortCompare(a, b, desc);
                if (result == 0) {
                    continue;
                }
                else {
                    return result;
                }
            }
            return '' as never;
        });
    };

    // 返回 removed data, 所以这个是 mutable 噢 
    Array.prototype.remove = function (filterOrItem: any) {
        let removeIndexes: number[] = [];
        for (let i = 0; i < this.length; i++) {
            let item = this[i];
            let remove = (typeof filterOrItem === 'function') ? filterOrItem(item, i, this) : item === filterOrItem;
            if (remove) removeIndexes.push(i);
        }
        let result: any[] = [];
        if (removeIndexes.length) {
            for (let index of removeIndexes) {
                result.push(this.splice(index, 1));
            }
        }
        return result;
    }

    Array.prototype.distinct = function (compare = (a: any, b: any) => a === b) {
        let a = this;
        let b : any[] = [];
        for (let i = 0; i < a.length; i++) {
            let ok = true;
            let aValue = a[i];
            for (let j = 0; j < b.length; j++) {
                let bValue = b[j];
                let same = compare(aValue, bValue);
                if (same) {
                    ok = false;
                    break;
                }
            }
            if (ok) b.push(a[i]);
        }
        return b;
    }
}