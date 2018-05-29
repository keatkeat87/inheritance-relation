import { isObject } from "./is-object";
import { Moment } from "moment";

export function isMomentObject(value : any) : value is Moment {
    return isObject(value) && (value as Object).constructor.name === 'Moment';
}