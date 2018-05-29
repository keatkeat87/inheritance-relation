import { NgModule } from '@angular/core';
import { MatCheckboxModule as RealMatCheckBboxModule } from '@angular/material';

import { MatCheckboxComponent } from './checkbox.component';
import { FormModule } from '../../../../form/form.module';


@NgModule({
    imports: [
        FormModule,
        RealMatCheckBboxModule
    ],
    exports: [MatCheckboxComponent],
    declarations: [MatCheckboxComponent],
    providers: [],
})
export class MatCheckboxModule { }
