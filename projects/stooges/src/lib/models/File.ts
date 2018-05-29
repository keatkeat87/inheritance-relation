export class SFile {
    constructor(data?: Partial<SFile>) {
        Object.assign(this, data);
    }
    //server path
    src: string;
    /** we use KB */
    size: number;
    name: string;
}
