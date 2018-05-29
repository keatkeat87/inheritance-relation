import { EntityConfig, ENTITY_CONFIG } from '../services/entity-config';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { HttpWatcher } from '../../http/http-watcher.service';
import { EntityService } from '../services/entity.service';
import { AbstractResourceService } from '../services/abstract-resource.service';
import { User } from './User';

@Injectable({
    providedIn: 'root'
})
export class UserService extends AbstractResourceService<User> {
    constructor(
        http: HttpClient,
        entityService: EntityService,
        httpWatcher: HttpWatcher,
        @Inject(ENTITY_CONFIG) entityConfig: EntityConfig
    ) {
        super(http, entityService, User, httpWatcher, entityConfig);
    }
}
