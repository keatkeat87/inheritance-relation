export function hasKeyByPath(obj: Object, path: string): boolean {
    let loopObj = obj;
    for (const prop of path.split('.')) {
        let has = Object.keys(loopObj).some(k => k == prop);
        if (!has) return false;
        loopObj = loopObj[prop];
    }
    return true;
}

