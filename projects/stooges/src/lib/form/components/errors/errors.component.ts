
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';

import { dynamicSlideUpDownAnimation } from '../../../animations/dynamic-slide-up-down.animation';
import { SubmitableFormDirective } from '../../directives/submitable-form.directive';

@Component({
    selector: 's-errors',
    templateUrl: './errors.component.html',
    styleUrls: ['./errors.component.scss'],
    //changeDetection: ChangeDetectionStrategy.OnPush, // 因为无法监听到 touched event 所以只好不使用 OnPush
    animations : [dynamicSlideUpDownAnimation]
})
export class ErrorsComponent implements OnInit, OnDestroy {
    constructor(
        @Optional() private formGroupDirective: FormGroupDirective,
        @Optional() private closestControl: ControlContainer,
        private cdr: ChangeDetectorRef,
        @Optional() private submitableForm: SubmitableFormDirective,
    ) { }
 
    @Input('controlName')
    formControlName = '';

    @Input('control')
    formControl: FormControl;

    private subscriptions = new Subscription();

    // 让外面也可以用, 容易些逻辑
    public get canShow() {
        return this.formControl.invalid && (this.submitted || (this.formControl.dirty && this.formControl.touched));
    }

    get submitted(): boolean {
        if (!this.formGroupDirective) return true;
        return this.formGroupDirective.submitted;
    }

    ngOnInit() {

        if (this.formGroupDirective) {
            // 有一种场景是只有 formControl 没有 form 的, 那么我们会把 submit 当作是 true
            this.formControl = this.formControl || this.closestControl.control!.get(this.formControlName) as FormControl;

            // 当嵌套 formGroup 的时候 我们需要替换一个正确的 formGroup 指令.
            if (this.submitableForm) this.formGroupDirective = this.submitableForm.formGroupDirective;

            this.subscriptions.add(
                this.formGroupDirective.ngSubmit.subscribe(() => {
                    this.cdr.markForCheck();
                })
            );
        }

        this.subscriptions.add(
            this.formControl.statusChanges.subscribe(_ => {
                this.cdr.markForCheck();
            })
        );
    }

    getKeys(obj: ValidationErrors | null): string[] {
        return (obj) ? Object.keys(obj) : [];
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
