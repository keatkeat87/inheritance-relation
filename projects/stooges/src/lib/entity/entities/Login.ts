import { User } from './User';
import { forwardRef } from '@angular/core';
import { Type } from '../../decorators/Type';
import { ForeignKey } from '../../decorators/ForeignKey';
import { Resource } from '../../decorators/Resource';

export class Login {

    @Type()
    LoginProvider: string;

    @Type()
    ProviderKey: string;

    @ForeignKey('user')
    UserId: number;

    @Resource(forwardRef(() => User))
    user: User;
}
