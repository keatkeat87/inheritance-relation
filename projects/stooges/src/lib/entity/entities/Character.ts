import { User } from './User';
import { forwardRef } from '@angular/core';
import { Key } from '../../decorators/Key';
import { ForeignKey } from '../../decorators/ForeignKey';
import { Resource } from '../../decorators/Resource';


export abstract class Character {

    @Key()
    Id: number = 0;

    @ForeignKey('user')
    userId: number;

    @Resource(forwardRef(() => User))
    user: User;
}

