import { SampleComponent } from './sample.component';
import { SamplePutFormComponent } from './sample-form/sample-put-form.component';
import { SamplePostFormComponent } from './sample-form/sample-post-form.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: SampleComponent,
            children: [
                {
                    path: 'create',
                    component: SamplePostFormComponent
                },
                {
                    path: ':Id/edit',
                    component: SamplePutFormComponent
                }
            ]
        }
    ])],
    exports: [RouterModule]
})
export class SampleRoutingModule { }
