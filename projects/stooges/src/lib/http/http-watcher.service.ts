import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { publishReplay, refCount, switchMap } from 'rxjs/operators';
import { ResourceStream, QueryParamsFnValue } from '../types';
import { fnValue } from '../common/methods/fn-value';
import { toNgHttpParams } from '../common/methods/to-ng-http-params';

@Injectable({
    providedIn: 'root' // 依赖的 HttpClient 必须在 root provide 哦
})
export class HttpWatcher {

    constructor(
        private http: HttpClient
    ) { }

    caches: {
        // { 'Users' : [stream,stream] }
        [entityKey: string]: ResourceStream<Object>[]
    } = {};

    getStream(url: string, queryParamsFnValue: QueryParamsFnValue = {}, watchEntities: string[] = []): ResourceStream<Object> {
        // 和 http 一样 subscribe 了才会 ajax
        // refresh 则马上会 ajax
        // subscribe 多多次也是同一个 ajax response

        const subject = new BehaviorSubject<Object>(null!);
        const observable = subject.asObservable().pipe(
            switchMap(nullOrResponse => {
                if (nullOrResponse == null) return this.http.get(url, {
                    params: toNgHttpParams(fnValue(queryParamsFnValue))
                });
                return of(nullOrResponse);
            }),
            publishReplay(1),
            refCount()
        );

        const stream: ResourceStream<Object> = {
            data$: observable,
            refreshAsync: (newQueryParamsFnValue?: QueryParamsFnValue) => {
                queryParamsFnValue = newQueryParamsFnValue || queryParamsFnValue; // 可以更新
                return this.http.get(url, {
                    params: toNgHttpParams(fnValue(queryParamsFnValue))
                }).toPromise().then(response => {
                    subject.next(response);
                });
            },
            subscription: {
                unsubscribe: () => {
                    watchEntities.forEach(key => {
                        const caches = this.caches[key];
                        const ipos = caches.indexOf(stream);
                        caches.splice(ipos, 1);
                    });
                },
                closed: false
            }
        };

        watchEntities.forEach(key => {
            this.caches[key] = this.caches[key] || [];
            this.caches[key].push(stream);
        });

        return stream;
    }


    async broadcastAsync(changeEntities: string[]) {
        // 性能优化
        if (changeEntities.length == 1) {
            const streams = this.caches[changeEntities[0]] || [];
            await Promise.all(streams.map(s => s.refreshAsync()));
        }
        else {
            const streams: ResourceStream<Object>[] = changeEntities.reduce<ResourceStream<Object>[]>((prev, key) => {
                return prev.concat(this.caches[key]);
            }, []);
            const temp: ResourceStream<Object>[] = [];
            streams.forEach(s => {
                // 一个 stream 可能会出现在多个 entityKey 里， 所以要确保不要跑重复的
                //不要跑重复的
                if (temp.indexOf(s) == -1) {
                    temp.push(s);
                }
            });
            await Promise.all(temp.map(s => s.refreshAsync()));
        }
    }
}
