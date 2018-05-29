import { NgModule } from '@angular/core';

import { SamplePostFormComponent } from './sample-form/sample-post-form.component';
import { SamplePutFormComponent } from './sample-form/sample-put-form.component';
import { SampleRoutingModule } from './sample-routing.module';
import { SampleComponent } from './sample.component';
import {
  CommonModule, MatInputModule, MatTableModule, MatSimpleSelectModule, FormModule, MatDynamicAccessorModule, EntityModule, MatConfirmDialogModule
} from '../../../../../stooges/src/public_api';
import { HeaderModule } from '../../shared/header/header.module';
import { MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule } from '@angular/material';
import { PaginationModule } from '../../shared/pagination/pagination.module';

@NgModule({
  imports: [
    SampleRoutingModule,
    CommonModule,
    MatInputModule,
    HeaderModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSimpleSelectModule,
    PaginationModule,
    MatIconModule,
    FormModule,
    MatDynamicAccessorModule,
    EntityModule,
    MatConfirmDialogModule,
    MatButtonModule
  ],
  declarations: [
    SampleComponent,
    SamplePostFormComponent,
    SamplePutFormComponent
  ]
})
export class SampleModule { }

