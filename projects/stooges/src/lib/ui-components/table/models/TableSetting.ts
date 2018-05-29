
export type TableSettingSearch = {
    /**
     * e.g. [Project.Entity.Person/address/text] odata 规范
     */
    string?: string[],
    number?: string[],
    date?: string[]
}

export class TableSetting {
    constructor(data?: Partial<TableSetting>) {
        Object.assign(this, data);
    }
    page = 1;
    sort: string;
    rowPerPage: number;
    desc = false;
    search?: TableSettingSearch;
}
