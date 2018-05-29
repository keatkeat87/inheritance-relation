import { Platform } from '@angular/cdk/platform';
import { Directive, ElementRef, Input, OnInit, Renderer2, OnDestroy } from '@angular/core';

// note : for 性能优化做的指令
@Directive({
  selector: '[sDragOver]'
})
export class DragOverDirective implements OnInit, OnDestroy {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private platform: Platform
  ) { }

  @Input()
  sDragOver: string | boolean

  listener: () => void

  ngOnInit() {
    if (this.platform.isBrowser) {
      this.listener = this.renderer.listen(this.elementRef.nativeElement, 'dragover', (e: Event) => {
        let isString = typeof (this.sDragOver) === 'string';
        let isBoolean = typeof (this.sDragOver) === 'boolean';
        if ((isString && this.sDragOver == '') || (isBoolean && this.sDragOver)) e.preventDefault();
      });
    }
  }

  ngOnDestroy() {
    if (this.listener) this.listener();
  }
}
