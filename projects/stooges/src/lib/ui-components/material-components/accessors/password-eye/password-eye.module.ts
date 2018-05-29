import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';

import { MatInputModule } from '../input/input.module';
import { MatPasswordEyeComponent } from './password-eye.component';
import { CommonModule } from '../../../../common/common.module';

@NgModule({
    imports: [
        CommonModule,
        MatInputModule,
        MatIconModule
    ],
    exports: [MatPasswordEyeComponent],
    declarations: [MatPasswordEyeComponent],
    providers: []
})
export class MatPasswordEyeModule { }
