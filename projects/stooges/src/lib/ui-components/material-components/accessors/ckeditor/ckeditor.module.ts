import { NgModule } from '@angular/core';

import { MatCkeditorComponent } from './ckeditor.component';
import { CommonModule } from '../../../../common/common.module';
import { FormModule } from '../../../../form/form.module';
import { CkeditorModule } from '../../../accessors/ckeditor/ckeditor.module';

@NgModule({
    imports: [
        CommonModule,
        FormModule,
        CkeditorModule
    ],
    exports: [MatCkeditorComponent],
    declarations: [MatCkeditorComponent],
    providers: [],
})
export class MatCkeditorModule { }
