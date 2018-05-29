import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { InvalidFocus } from '../types';
import { AbstractAccessorComponent } from './abstract-accessor';

/*
  目前 form 体验有 3 个问题, 都是跟操作 dom 有关的, 目前 no angular way to fix
  1. autofocus first input when form appear ( form maybe will delay appear due to ajax 哦 )
  2. submit done reset autofocus back to first input
  1,2 问题目前的方案是在 element 上打 #firstFocusableEl 然后通过 viewchild 获取 element | component（material component) 来调用 focus
  for case 1 , 需要 subscribe viewchild change, for case 2 直接在 reset 的时候调用 focus 就可以了
  3. submit done reset scroll to top
  这个不可以用 scrolltoview 做, 因为通常我们是希望 scroll to top, 比 form elemenet 在高一点 的位置, 所以只能用 scrollTop
  而 scrollTop 又 depend on 设计, 所以基本不能封装，必须每一次要特别处理了.

  4. submit but some formcontrol invalid, need focus to it
  需要写一个 class.error='control.invalid' 做定位. 然后通过 viewchildren 获取全部, 然后在 submit 同时发现 invalid 时调用 focus. ok

  5. successful display
  由于 submit 成功后可能胡 scroll 走掉, 所以 successful 最好可以出现在一个全局定位的地方, 所以需要一个全局 service 类似 youtubeloading 那样.

  note :
  关于 focus 的 solution, 可以考虑用 formcontrol 做为标签.
  经过测试, focus !== scroll (ipad safari, 而且 focus scroll 的位置, 也不一定理想)
  所以 scroll 必须另外实现 ...

*/

/*
 配合 MaterialAccessor 策略的话可以使用 pending and error focus 哦
*/
export abstract class AbstractFormComponent implements OnDestroy {

    constructor(
        protected cdr: ChangeDetectorRef
    ) { }

    /**
     *
     * @param pendingPromise 如果 waitForAccessorPending = false 那么就交给 internalSubmitAsync 处理 promise 吧
     */
    protected abstract async internalSubmitAsync(pendingPromise?: Promise<void>): Promise<boolean>;
    protected successfulTimer = 1500;
    protected resetOnSuccessful = false;
    protected waitForAccessorPending = true;

    form: FormGroup;
    loading = false;
    successful = false;
    protected defaultValue: any;

    // 这个主要配合 material accessor 使用
    @ViewChildren(AbstractAccessorComponent, { read: AbstractAccessorComponent })
    abstractAccessorComponentQueryList: QueryList<AbstractAccessorComponent>;

    @ViewChildren(InvalidFocus, { read: InvalidFocus })
    invalidFocusQueryList: QueryList<InvalidFocus>;

    private timeout: any;
    get showFormError() {
        return this.formGroupDirective.submitted && this.form.invalid;
    }

    reset(needConfirm = false) {
        if (needConfirm) {
            if (confirm('confirm reset ?')) {
                this.formGroupDirective.resetForm(this.defaultValue);
            }
        }
        else {
            this.formGroupDirective.resetForm(this.defaultValue);
        }
    }

    @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective; // will get first one

    unique = false;

    protected focusFirstInvalid() {
        const invalids = this.invalidFocusQueryList.toArray().filter(a => a.invalid);
        if (invalids.length > 0) {
            invalids[0].focus();
        }
    }

    async submit() {
        if (this.form.invalid) {
            console.log(this.form);
        }

        // 支持 accessor pending submit
        // 效果 :
        // 1. 如果全部 valid 只有 pending 的 accessor invalid 那么算 valid 可以继续 submit (做法是 get all formControl filter 掉 pending 的, 然后看是不是全部 valid 是就 ok 了)
        // 2. internalSubmitAsync 可以直接处理 promise, 记得 resolve 后要 check 多一次 form valid
        // 3. internalSubmitAsync  也可以通过 waitForAccessorPending 来说等 pending 都 ok 了而且全部 valid 才执行. (这个是默认做法)


        // check pending
        let pendingPromise: Promise<void> | undefined;
        const pendingAccessors = this.abstractAccessorComponentQueryList.toArray().filter(a => a.checkPending());
        let bypass = false;
        if (pendingAccessors.length > 0) {
            // step :
            // 递归获取所有 formControl
            // invalid 的假如是 pending, 那么就 bypass
            // 做出 pendingPromise, 如果没有 bypass 就不用做啦
            const recursiveGetFormControl = (control: FormGroup | FormArray, store: FormControl[]) => {
                const abstractControls = (control instanceof FormGroup) ? Object.keys(control.controls).map(key => control.controls[key]) : control.controls;
                abstractControls.forEach(abstractControl => {
                    if (abstractControl instanceof FormControl) {
                        store.push(abstractControl);
                    }
                    else if (abstractControl instanceof FormArray || abstractControl instanceof FormGroup) {
                        recursiveGetFormControl(abstractControl, store); //递归
                    }
                });
            };

            const formControls: FormControl[] = [];
            recursiveGetFormControl(this.form, formControls);
            // 所有 invalid 的都在 pendingAccessors 里找到就 bypass
            bypass = formControls.filter(f => f.invalid).every(f => pendingAccessors.find(p => p.formControl === f) != null);

            if (bypass) {
                const pendingEmitters = pendingAccessors.map(a => a.getPendingEmitter());
                pendingPromise = new Promise<void>((resolve, reject) => {
                    combineLatest(pendingEmitters).pipe(
                        take(1),
                        catchError(() => {
                            reject();
                            return '';
                        })
                    ).subscribe(() => {
                        resolve();
                    });
                });
            }
        }

        if (this.form.valid || bypass) {
            if (this.timeout != null) {
                clearTimeout(this.timeout);
                this.timeout = null;
                this.successful = false;
            }
            this.loading = true;
            try {
                this.unique = false;
                if (this.waitForAccessorPending && pendingPromise) {
                    await pendingPromise;
                    // 模拟 resubmit
                    await this.submit();
                }
                else {
                    const successful = await this.internalSubmitAsync(pendingPromise); // 传 promise 给里面控制
                    if (successful) {
                        this.successful = true;
                        this.timeout = setTimeout(() => {
                            this.successful = false;
                            this.timeout = null;
                            this.cdr.markForCheck();
                        }, this.successfulTimer);
                        if (this.resetOnSuccessful) {
                            this.reset();
                        }
                    }
                }
            }
            catch (e) {
                if (e instanceof HttpErrorResponse && e.status == 400 && e.error.error.message == 'unique') {
                    this.unique = true;
                }
                else {
                    throw e;
                }
            }
            finally {
                this.loading = false;
                this.cdr.markForCheck();
            }
        }
        else {
            this.focusFirstInvalid();
        }
    }



    ngOnDestroy() {
        if (this.timeout != null) {
            clearTimeout(this.timeout);
        }
    }

}
