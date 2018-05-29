import { 
  Directive, 
  ElementRef, 
  OnDestroy, 
  OnInit, 
  Renderer2, 
  AfterViewInit
 } from '@angular/core';

// sample
// <textarea sAutoResize ></textarea>
// <input sAutoResize type="text" />
@Directive({
  selector: '[sAutoResize]',
})
export class AutoResizeDirective implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }
   
  listener: () => void;

  private heightOrWidth: 'height' | 'width';
  private overflowXOrY: 'overflowY' | 'overflowX';
  private scrollHeightOrWidth: 'scrollHeight' | 'scrollWidth';
  private minimum: number;

  private adjust() {
    const element = (this.elementRef.nativeElement as HTMLElement);
    element.style[this.overflowXOrY] = 'scroll';
    element.style[this.heightOrWidth] = '0px';
    const final = (element[this.scrollHeightOrWidth] < this.minimum) ? this.minimum : element[this.scrollHeightOrWidth];
    element.style[this.heightOrWidth] = final + 'px';
    element.style[this.overflowXOrY] = 'hidden';
  }

  ngOnInit() {
    const isTextarea = (this.elementRef.nativeElement as HTMLElement).tagName == 'TEXTAREA';
    this.heightOrWidth = (isTextarea) ? 'height' : 'width';
    this.overflowXOrY = (isTextarea) ? 'overflowY' : 'overflowX';
    this.scrollHeightOrWidth = (isTextarea) ? 'scrollHeight' : 'scrollWidth';

    const styleValue = window.getComputedStyle(this.elementRef.nativeElement).getPropertyValue(this.heightOrWidth);
    this.minimum = +(styleValue.substring(0, styleValue.length - 'px'.length));

    this.listener = this.renderer.listen(this.elementRef.nativeElement, 'input', () => {
      this.adjust();
    });
  }

  ngAfterViewInit() {
    this.adjust();
  }

  ngOnDestroy() {
    this.listener();
  }

}
