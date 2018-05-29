import { PaginationComponent } from './pagination.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '../../../../../stooges/src/public_api';
import { MatIconModule } from '@angular/material';



@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule
    ],
    exports: [PaginationComponent],
    declarations: [
        PaginationComponent
    ]
})
export class PaginationModule { }
