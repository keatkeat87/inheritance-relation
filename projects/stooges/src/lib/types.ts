import { Observable, SubscriptionLike as ISubscription } from 'rxjs';

export type AM_PM = 'AM' | 'PM';
export type ObjectFix = 'contain' | 'cover';
export interface QueryParams { [propName: string]: string | null; } // null 表示拿掉
export type QueryParamsFnValue = QueryParams | (() => QueryParams);
export type Constructor<T = any> = new (...args: any[]) => T;
export interface Entity { Id: number; }
export interface ResourceStream<T> { data$: Observable<T>; subscription: ISubscription; refreshAsync: (newQueryParamsFnValue?: QueryParamsFnValue) => Promise<void>; }
export interface Dimension { width: number; height: number; }
export interface XY { x: number; y: number; }
export interface CropData { x: number; y: number; width: number; height: number; }
export interface Dictionary { [prop: string]: any; }
export interface Metadata {
    key: string,
    value: any
}
export type CompareType = 'eq' | 'gt' | 'ge' | 'lt' | 'le';
export type CompareWith<T = any> = (a : T, b : T) => boolean;

export interface TitleMetaDescription { title?: string; metaDescription?: string; }
export interface RobotsRule { self: RobotsValue; children: RobotsValue; }
export type RobotsValue = 'index, follow' | 'noindex, nofollow' | 'index, nofollow' | 'noindex, follow';
export type Device = 'pc' | 'mobile' | 'tablet';
export enum KeyCode {
    arrowLeft = 37,
    arrowUp = 38,
    arrowRight = 39,
    arrowDown = 40,
    escape = 27,
    enter = 13,
    delete = 46,
    space = 32,
    backspace = 8
}

