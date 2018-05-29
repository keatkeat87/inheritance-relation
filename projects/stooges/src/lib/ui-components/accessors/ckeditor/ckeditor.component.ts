import { CkeditorService } from './ckeditor.service';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


// note :
// 只支持 Browse Upload.
// ck 原本支持 browse, upload, drag & paste
// upload 用的是很旧的 api, 不支持拦截, 不支持 AccessToken 的模式, 所以弃用.
// drag & paste 虽然支持拦截, 不过我们体验没必要做那么好, 支持 browse 也就够了.
// browse 没有拦截概念, 因为只是 popup other window, 整个 upload 是我们自己实现的.

// sample
// <s-ckeditor formControlName="ck" ></s-ckeditor>

export type CkeditorComponentModel = string;
export type CkeditorComponentPublishMethod = (value: CkeditorComponentModel) => void;

@Component({
  selector: 's-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CkeditorComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CkeditorComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {

  private editor: any;
  private model: string;

  @ViewChild('ck', { read: ElementRef }) ck: ElementRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private ckeditorService: CkeditorService
  ) { }

  ngOnInit() {

  }

  @Input()
  filebrowserBrowseUrl = '/ck-image-browse';

  public focus() {
    this.editor.focus();
  }

  async ngAfterViewInit() {
    await this.ckeditorService.loadScriptAsync();    
    const CKEDITOR = window['CKEDITOR'];
    this.editor = CKEDITOR.replace(this.ck.nativeElement, {
      filebrowserBrowseUrl: this.filebrowserBrowseUrl
    });

    if (this.model) {
      this.editor.setData(this.model);
    }
    this.editor.on('change', (event: any) => {
      if (this.lockCount > 0) {
        this.lockCount--;
      } else {
        const data = event.editor.getData();
        this.publish(data);
        this.ngZone.run(() => {
          this.cdr.markForCheck();
        });
      }
    });
  }

  ngOnDestroy() {
    this.editor.destroy(true);
  }

  private lockCount = 0; // ck 在 setData 的时候会触发 2 change event, 这是我们不想要的, 所以设计了一个 lockCount 来 skip 掉

  writeValue(value: CkeditorComponentModel): void {
    if (this.editor) {
      this.lockCount = 2;
      this.editor.setData(value);
    } else {
      this.model = value;
    }
  }

  private publish: CkeditorComponentPublishMethod;
  registerOnChange(fn: CkeditorComponentPublishMethod): void {
    this.publish = fn;
  }
  touch: any;
  registerOnTouched(fn: any): void {
    this.touch = fn;
  }

}
