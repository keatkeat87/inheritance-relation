import { EnumMetadata } from "../../../decorators/Enum";
import { TControl } from "./TControl";
import { valueToDisplay } from '../../../common/methods/value-to-display';

export class EnumTConrol extends TControl {
    constructor(data?: Partial<EnumTConrol>) {
      super();
      Object.assign(this, data);
    }
    enumMetadata: EnumMetadata
    valueToDisplay(value: string) {
      if (!value) return value;
      let item = this.enumMetadata.items.find(i => i.value == value)!;
      return item.display || valueToDisplay(item.value);
    }
  }