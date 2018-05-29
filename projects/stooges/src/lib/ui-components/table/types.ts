import { TControl } from "./models/TControl";
export type TableCellType = 'Tick' | 'Image' | 'Youtube' | 'File' | 'Text' | 'Textarea' | 'Amount' | 'Date' | 'Datetime' | 'Time' | 'Enum' | 'OdataType'

export interface KeyAndTControl {
    namespace?: string
    key: string
    tControl: TControl
}