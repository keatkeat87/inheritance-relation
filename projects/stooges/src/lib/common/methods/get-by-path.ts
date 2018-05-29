export function getByPath(obj: Object, path: string): any | undefined {
    let loopObj = obj;
    for (const prop of path.split('.')) {
        if (loopObj[prop] === undefined) return undefined;
        loopObj = loopObj[prop];
    }
    return loopObj;
}