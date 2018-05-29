import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

import { MatTextareaComponent } from './textarea.component';
import { CommonModule } from '../../../../common/common.module';
import { FormModule } from '../../../../form/form.module';

@NgModule({
    imports: [
        CommonModule,
        FormModule,
        MatInputModule,
        MatFormFieldModule
    ],
    exports: [MatTextareaComponent],
    declarations: [MatTextareaComponent],
    providers: []
})
export class MatTextareaModule { }
