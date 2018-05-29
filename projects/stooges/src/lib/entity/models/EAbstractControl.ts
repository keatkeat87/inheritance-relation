import { defineHideProperty } from "../../common/methods/define-hide-property";
import { Metadata } from "../../types";
import { BehaviorSubject } from "rxjs";
import { EGroup } from "./EGroup";
import { EArray } from "./EArray";
import { Validator } from "../../form/types";

export class EAbstractControl {
    constructor() {
        defineHideProperty(this, '$parent', null);
    }

    $parent: EGroup | EArray | null
    metadatas: Metadata[] = [];
    getMetadata(key: string) {
        let data = this.metadatas.find(m => m.key == key);
        return data ? data.value : null;
    }
    hasMetadata(key: string) {
        let data = this.metadatas.find(m => m.key == key);
        return data != undefined;
    }
    displayName: string
    validators: BehaviorSubject<Validator[]>;
}



