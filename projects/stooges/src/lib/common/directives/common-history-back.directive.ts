import { Directive } from '@angular/core';

@Directive({
    selector: '[sCommonHistoryBack]',
    host: {
        '(click)': 'historyBack()'
    }
})
export class CommonHistoryBackDirective {

    constructor() { }

    historyBack() {
        history.back();
    }
}
