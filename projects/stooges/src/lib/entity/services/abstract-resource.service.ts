import { map } from 'rxjs/operators';
import { EntityConfig } from './entity-config';
import { HttpClient, HttpRequest } from '@angular/common/http';

import { HttpWatcher } from '../../http/http-watcher.service';
import { EntityService } from './entity.service';
import { Entity, QueryParams, QueryParamsFnValue, ResourceStream, Constructor } from '../../types';
import { toNgHttpParams } from '../../common/methods/to-ng-http-params';
 
export abstract class AbstractResourceService<T extends Entity> {

    constructor(
        protected http: HttpClient,
        protected entityService: EntityService,
        protected entity: Constructor,
        protected httpWatcher: HttpWatcher,
        protected entityConfig: EntityConfig
    ) {
    }

    protected get prefixUrl(): string {
        return `/api/${this.entityName}`;
    }
    protected get entityName(): string {
        return this.entity['entityName'];
    }

    protected mapMethodOfQuery = (data: Object): T[] => {
        const resources = data['value'];
        const result = this.entityService.parse(resources, this.entity);
        if (data['@odata.count'] != null) {
            result['@odata.count'] = data['@odata.count'];
        }
        return result;
    }

    private tryAddOrderby(queryParams: QueryParams) {
        if (!(queryParams as Object).hasOwnProperty('$orderby')) {
            queryParams['$orderby'] = 'Id desc';
        }
    }

    queryAsync(queryParams: QueryParams = {}): Promise<T[]> {
        this.tryAddOrderby(queryParams);
        return this.http.get(this.prefixUrl, { params: toNgHttpParams(queryParams) }).pipe(map<Object, T[]>(this.mapMethodOfQuery)).toPromise();
    }

    queryWatch(queryParamsFnValue: QueryParamsFnValue = {}, watchEntities: string[] = [this.entityName]): ResourceStream<T[]> {
        if (typeof (queryParamsFnValue) === 'function') {
            const old = queryParamsFnValue;
            queryParamsFnValue = () => {
                const params = old();
                this.tryAddOrderby(params);
                return params;
            };
        }
        else {
            this.tryAddOrderby(queryParamsFnValue);
        }

        const stream = this.httpWatcher.getStream(this.prefixUrl, queryParamsFnValue, watchEntities);
        return {
            ...stream,
            data$: stream.data$.pipe(map(this.mapMethodOfQuery))
        };
    }

    private modifyGetQueryParams(Id: number, queryParams: QueryParams) {
        queryParams['$filter'] = (queryParams['$filter']) ? `Id eq ${Id} and (${queryParams['$filter']})` : `Id eq ${Id}`;
    }

    private mapMethodOfGet = (resources: T[]): T => {
        return resources[0];
    }

    getAsync(Id: number, queryParams: QueryParams = {}): Promise<T> {
        this.modifyGetQueryParams(Id, queryParams);
        return this.queryAsync(queryParams).then<T>(this.mapMethodOfGet);
    }

    getWatch(Id: number, queryParams: QueryParams = {}, watchEntities: string[] = [this.entityName]): ResourceStream<T> {
        this.modifyGetQueryParams(Id, queryParams);
        const stream = this.queryWatch(queryParams, watchEntities);
        return {
            ...stream,
            data$: stream.data$.pipe(map(this.mapMethodOfGet))
        };
    }

    // 让外面容易实现 batch post
    getPostRequest(resource: T, queryParams: QueryParams = {}) {
        resource = this.entityService.format(resource, this.entity);
        return new HttpRequest<T>('POST', this.prefixUrl, resource, { params: toNgHttpParams(queryParams) });
    }

    async postAsync(resource: T, queryParams: QueryParams = {}, changeEntities: string[] = [this.entityName], waitForBroadcast = false): Promise<void> {
        const req = this.getPostRequest(resource, queryParams);
        await this.http.post(req.url, req.body, {
            params: req.params,
        }).toPromise();
        const promise = this.httpWatcher.broadcastAsync(changeEntities).catch(() => {
            if (waitForBroadcast) throw new Error('broadcast');
        });
        if (waitForBroadcast) await promise;
        //return null;
        // return this.http.post(req.url, req.body, {
        //     params : req.params,
        // }).do(() => this.httpWatcher.broadcastAsync(changeEntities)).mapTo(null).toPromise();
    }

    async putAsync(resource: T, queryParams: QueryParams = {}, changeEntities: string[] = [this.entityName], convertToPureResource = true, waitForBroadcast = false): Promise<void> {
        resource = this.entityService.format(resource, this.entity);
        const pureResource = (convertToPureResource) ? this.filterPutData(resource) as Entity : resource;
        await this.http.put(`${this.prefixUrl}(${pureResource.Id})`, pureResource, {
            params: toNgHttpParams(queryParams)
        }).toPromise();
        const promise = this.httpWatcher.broadcastAsync(changeEntities).catch(() => {
            if (waitForBroadcast) throw new Error('broadcast');
        });
        if (waitForBroadcast) await promise;
    }

    async deleteAsync(Id: number, queryParams: QueryParams = {}, changeEntities: string[] = [this.entityName], waitForBroadcast = false): Promise<void> {
        await this.http.delete(`${this.prefixUrl}(${Id})`, { params: toNgHttpParams(queryParams) }).toPromise();
        const promise = this.httpWatcher.broadcastAsync(changeEntities).catch(() => {
            if (waitForBroadcast) throw new Error('broadcast');
        });
        if (waitForBroadcast) await promise;
    }

    async changeSortAsync(aSort: number, bSort: number, changeEntities: string[] = [this.entityName], waitForBroadcast = false): Promise<void> {
        await this.http.post(`${this.prefixUrl}/RPC.changeSort`, { aSort, bSort }).toPromise();
        const promise = this.httpWatcher.broadcastAsync(changeEntities).catch(() => {
            if (waitForBroadcast) throw new Error('broadcast');
        });
        if (waitForBroadcast) await promise;
    }

    private filterPutData(resource: any) {
        //普通 clone 就可以了
        const clone = {};
        const keys = Object.keys(resource);
        keys.forEach(key => {
            const v = resource[key];
            const isResource = Reflect.hasMetadata('Resource', resource, key);
            const isResources = Reflect.hasMetadata('Resources', resource, key);
            if (!isResource && !isResources) {
                clone[key] = v;
            }
        });
        return clone;
    }
}
