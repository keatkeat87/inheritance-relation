import { TControl } from "./TControl";

export class TGroup {
    [propName: string]: TGroup | TControl | any
    keys(): string[] {
      return Object.keys(this);
    }
  }