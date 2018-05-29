import { CommonModule } from '../../common/common.module';
import { NgModule } from '@angular/core';
import { HighlightTextComponent } from './highlight-text.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports : [HighlightTextComponent],
  declarations: [HighlightTextComponent]
})
export class HighlightTextModule { }
