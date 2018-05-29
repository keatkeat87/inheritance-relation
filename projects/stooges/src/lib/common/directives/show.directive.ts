import { Directive, ElementRef, Input, Renderer2, RendererStyleFlags2 } from '@angular/core';


@Directive({
    selector: '[sShow]'
})
export class ShowDirective {
    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }

    @Input()
    set sShow(value: any) {
        if (value) {
            this.renderer.removeStyle(this.el.nativeElement, 'display');
        }
        else {
            this.renderer.setStyle(this.el.nativeElement, 'display', 'none', RendererStyleFlags2.Important);
        }
    }
}
