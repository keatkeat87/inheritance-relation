import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule as NgFormsModule } from '@angular/forms';

import { ErrorsComponent } from './components/errors/errors.component';
import { CommonModule } from '../common/common.module';
import { InvalidFocusDirective } from './directives/invalid-focus.directive';
import { SubmitableFormDirective } from './directives/submitable-form.directive';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [
        NgFormsModule,
        ReactiveFormsModule,
        ErrorsComponent,
        InvalidFocusDirective,
        SubmitableFormDirective
    ],
    declarations: [
        ErrorsComponent,
        InvalidFocusDirective,
        SubmitableFormDirective
    ],
    providers: []
})
export class FormModule { }
