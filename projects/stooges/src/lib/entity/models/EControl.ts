import { EAbstractControl } from "./EAbstractControl";

export class EControl extends EAbstractControl {
    constructor(data?: Partial<EControl>) {
        super();
        Object.assign(this, data);
    }
    defaultValue: any
    displayName: string
}