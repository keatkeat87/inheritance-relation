import { EventEmitter, Input, OnInit, Optional, ViewChild, ChangeDetectorRef, OnDestroy, HostBinding, HostListener } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { EGroupDirective } from '../../entity/directives/e-group.directive';
import { EGroupNameDirective } from '../../entity/directives/e-group-name.directive';
import { InvalidFocus } from '../types';
import { EControl } from '../../entity/models/EControl';

export type Focusable = { focus: () => void };

export class AbstractAccessorComponent implements OnInit, OnDestroy, InvalidFocus {

    // override, 这一套 reset,focus 等等, 最要是配合 AbstractForm 使用
    // reset() { } //暂时没有 reset
    @HostListener('focus')
    public focus() {
        this.focusable.focus();
    }
    checkPending(): boolean {
        return false;
    }
    getPendingEmitter(): EventEmitter<void> {
        throw new Error('child forgot override or forgot checkPending before call this');
    }

    get invalid(): boolean {
        return this.formControl.invalid;
    }

    constructor(
        protected cdr: ChangeDetectorRef,
        @Optional() private closestControl?: ControlContainer,
        @Optional() private eGroupDirective?: EGroupDirective,
        @Optional() private eGroupNameDirective?: EGroupNameDirective
    ) { }

    @Input('controlName')
    formControlName: string;

    @Input('control')
    formControl: FormControl;

    @Input()
    eControl: EControl;

    @Input()
    displayName = '';

    @Input()
    @HostBinding('tabindex')
    tabindex = 0;

    @ViewChild('focusable')
    focusable: Focusable;

    required = false;

    sub = new Subscription();

    ngOnInit() {
        // Note :
        // 可以没有 eControl 的, 只是外面用的人要小心, 比如 upload file 就会坏掉
        // 这个没有 eControl 概念设计来用于那种没有 form 但又有一个 control 的情况
        this.formControl = this.formControl || this.closestControl!.control!.get(this.formControlName) as FormControl;
        if (!this.eControl) {
            if (this.eGroupNameDirective == null && this.eGroupDirective == null) {
                // skip
            }
            else {
                const eGroup = (this.eGroupNameDirective != null) ? this.eGroupNameDirective.eGroup : this.eGroupDirective!.eGroup;
                this.eControl = this.eControl || eGroup[this.formControlName];
            }
        }

        if (this.eControl) {
            this.sub.add(
                this.eControl.validators.subscribe(validators => {
                    this.required = validators.find(v => v.name == 'required') != null;
                    this.cdr.markForCheck();
                })
            )
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
