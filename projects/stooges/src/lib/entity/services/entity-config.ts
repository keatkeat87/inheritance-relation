import { InjectionToken } from '@angular/core';
import { Constructor } from '../../types';

// provide in root
export class EntityConfig {
    constructor(data: EntityConfig) {
        Object.assign(this, data);
    }
    entities: { [className: string]: Constructor };
    sqlRoles: { Id: number, Name: string }[];
}

export let ENTITY_CONFIG = new InjectionToken<EntityConfig>('ENTITY_CONFIG');

 