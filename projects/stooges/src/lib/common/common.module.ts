import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { SafeStylePipe } from './pipes/safe-style.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { AgePipe } from './pipes/age.pipe';
import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { AutoResizeDirective } from './directives/auto-resize.directive';
import { DeviceOnlyDirective } from './directives/device-only.directive';
import { DragOverDirective } from './directives/drag-over.directive';
import { HideDirective } from './directives/hide.directive';
import { CommonHistoryBackDirective } from './directives/common-history-back.directive';
import { ShowDirective } from './directives/show.directive';
import { ArrayRangePipe } from './pipes/array-range.pipe';
import { CamelCaseToRegularStringPipe } from './pipes/camel-case-to-regular-string.pipe';
import { DownloadPipe } from './pipes/download.pipe';
import { YoutubeCodePipe } from './pipes/youtube-code.pipe';
import { ImageDirective } from './directives/image.directive';

@NgModule({
  imports: [],
  exports: [
    NgCommonModule,
    AutoResizeDirective,
    DeviceOnlyDirective,
    DragOverDirective,
    HideDirective,
    CommonHistoryBackDirective,
    ShowDirective,
    ImageDirective,
    AgePipe,
    ArrayRangePipe,
    CamelCaseToRegularStringPipe,
    DownloadPipe,
    SafeHtmlPipe,
    SafeStylePipe,
    SafeUrlPipe,
    YoutubeCodePipe
  ],
  declarations: [
    AutoResizeDirective,
    DeviceOnlyDirective,
    DragOverDirective,
    HideDirective,
    CommonHistoryBackDirective,
    ShowDirective,
    ImageDirective,
    AgePipe,
    ArrayRangePipe,
    CamelCaseToRegularStringPipe,
    DownloadPipe,
    SafeHtmlPipe,
    SafeStylePipe,
    SafeUrlPipe,
    YoutubeCodePipe
  ]
})
export class CommonModule { }
