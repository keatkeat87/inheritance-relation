import { NgModule } from '@angular/core';
import { MatIconModule, MatMenuModule, MatButtonModule } from '@angular/material';
import { HeaderComponent } from './header.component';


@NgModule({
    imports: [
        MatIconModule,
        MatMenuModule,
        MatButtonModule
    ],
    exports: [HeaderComponent],
    declarations: [
        HeaderComponent
    ]
})
export class HeaderModule { }
