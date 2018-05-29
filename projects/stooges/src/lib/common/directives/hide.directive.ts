import { Directive, ElementRef, Input, Renderer2, RendererStyleFlags2 } from '@angular/core';

@Directive({
    selector: '[sHide]'
 })
export class HideDirective {

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }

    @Input()
    set sHide(value: any) {
        if (value) {
            this.renderer.setStyle(this.el.nativeElement, 'display', 'none', RendererStyleFlags2.Important);
        }
        else {
            this.renderer.removeStyle(this.el.nativeElement, 'display');
        }
    }
}
