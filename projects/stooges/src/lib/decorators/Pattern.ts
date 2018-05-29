export class PatternMetadata {
    pattern: string | RegExp;
    constructor(data: Partial<PatternMetadata>) {
        Object.assign(this, data);
    }
}
export function Pattern(pattern: string | RegExp) {
    return Reflect.metadata('Pattern', new PatternMetadata({
        pattern
    }));
}