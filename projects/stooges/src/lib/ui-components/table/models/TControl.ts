import { TableCellType } from "../types";

export class TControl {
    constructor(data?: Partial<TControl>) {
      Object.assign(this, data);
    }
    displayName: string
    sortable: boolean | (() => boolean) // 处理继承 resource 的情况下需要动态的 sortable 
    cellType: TableCellType
  }