import { NgModule } from '@angular/core';
import { MatInputModule as RealMatInputModule, MatFormFieldModule } from '@angular/material';

import { MatInputComponent } from './input.component';
import { CommonModule } from '../../../../common/common.module';
import { FormModule } from '../../../../form/form.module';

@NgModule({
    imports: [
        CommonModule,
        FormModule,
        RealMatInputModule,
        MatFormFieldModule
    ],
    exports: [MatInputComponent],
    declarations: [MatInputComponent],
    providers: []
})
export class MatInputModule { }
