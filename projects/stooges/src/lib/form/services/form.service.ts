import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { JsonMetadata } from '../../decorators/Json';
import { METADATA_KEY } from '../../decorators/metadata-key';
import { PatternMetadata } from '../../decorators/Pattern';
import { MinMetadata } from '../../decorators/Min';
import { MaxMetadata } from '../../decorators/Max';
import { RangeMetadata } from '../../decorators/Range';
import { DisplayNameMetadata } from '../../decorators/DisplayName';
import { CompareMetadata } from '../../decorators/Compare';
import { BehaviorSubject } from 'rxjs';
import { valueToDisplay } from '../../common/methods/value-to-display';
import { isObject } from '../../common/methods/is-object';
import { Validator } from '../../form/types';
import { EGroup } from '../../entity/models/EGroup';
import { EAbstractControl } from '../../entity/models/EAbstractControl';
import { EArray } from '../../entity/models/EArray';
import { EControl } from '../../entity/models/EControl';
import { ValidatorsService } from '../services/validators.service';


@Injectable({
    providedIn: 'root'
})
export class FormService {

    constructor(
        protected v: ValidatorsService,
    ) { }

    buildFormEDM(resource: any, eGroup = new EGroup(), parentDisplayName?: string): EGroup {
        // note :
        // Json JAny & JArrayAny 不处理. take care 哦.
        // 不需要看 odata.type了, resource should be is after parse.
        eGroup.resource = resource;
        eGroup.validators = new BehaviorSubject([]);
        const keys = Object.keys(resource);
        keys.forEach(key => {
            const value = resource[key];
            const isResource = Reflect.hasMetadata(METADATA_KEY.Resource, resource, key);
            const isResources = Reflect.hasMetadata(METADATA_KEY.Resources, resource, key);
            const isManyToMany = Reflect.hasMetadata(METADATA_KEY.ManyToMany, resource, key);
            const isComplexType = Reflect.hasMetadata(METADATA_KEY.ComplexType, resource, key);

            //check json
            const jsonMetaData = Reflect.getMetadata(METADATA_KEY.Json, resource, key) as JsonMetadata;
            const isJson = Reflect.hasMetadata(METADATA_KEY.Json, resource, key);
            const isJsonWithConstructor = isJson && jsonMetaData.hasConstructor;

            let metadatas = Reflect.getMetadataKeys(resource, key).map(metadataKey => {
                return {
                    key: metadataKey,
                    value: Reflect.getMetadata(metadataKey, resource, key)
                }
            });

            let displayNameMetadata: DisplayNameMetadata = Reflect.getMetadata(METADATA_KEY.FormDisplayName, resource, key) || Reflect.getMetadata(METADATA_KEY.DisplayName, resource, key);
            let displayName = displayNameMetadata ? displayNameMetadata.name : valueToDisplay(key, 'spaceFirstUpper');
            if (parentDisplayName) displayName = parentDisplayName + ' ' + displayName;

            let validators: Validator[] = [];
            let type = Reflect.getMetadata(METADATA_KEY.Type, resource, key);
            if (Reflect.hasMetadata(METADATA_KEY.Required, resource, key)) {
                validators.push({ name: 'required', validatorFn: this.v.required() });
            }
            if (Reflect.hasMetadata(METADATA_KEY.Pattern, resource, key)) {
                const patternMetadata = Reflect.getMetadata(METADATA_KEY.Pattern, resource, key) as PatternMetadata;
                validators.push({ name: 'pattern', validatorFn: Validators.pattern(patternMetadata.pattern) });
            }
            if (Reflect.hasMetadata(METADATA_KEY.Min, resource, key)) {
                let { min, equal } = Reflect.getMetadata(METADATA_KEY.Min, resource, key) as MinMetadata;
                validators.push({ name: 'min', validatorFn: this.v.min(min, equal) });
            }
            if (Reflect.hasMetadata(METADATA_KEY.Max, resource, key)) {
                let { max, equal } = Reflect.getMetadata(METADATA_KEY.Max, resource, key) as MaxMetadata;
                validators.push({ name: 'max', validatorFn: this.v.max(max, equal) });
            }
            if (Reflect.hasMetadata(METADATA_KEY.Range, resource, key)) {
                let { min, max, equal } = Reflect.getMetadata(METADATA_KEY.Range, resource, key) as RangeMetadata;
                validators.push({ name: 'range', validatorFn: this.v.range(min, max, equal) });
            }
            if (Reflect.hasMetadata(METADATA_KEY.Amount, resource, key)) {
                validators.push({ name: 'min', validatorFn: this.v.min(0) });
            }
            if (Reflect.hasMetadata(METADATA_KEY.Email, resource, key)) {
                validators.push({ name: 'email', validatorFn: this.v.email() });
            }
            if (Reflect.hasMetadata(METADATA_KEY.SixDigitToken, resource, key)) {
                validators.push({ name: 'sixDigitToken', validatorFn: this.v.sixDigitToken() });
            }            
            if (type === Date) {
                validators.push({ name: 'date', validatorFn: this.v.date() });
            }

            if (value != null && (isResource || isComplexType || (isJsonWithConstructor && isObject(value)))) {
                let childGroup = new EGroup();
                childGroup.$parent = eGroup;
                childGroup.metadatas = metadatas;
                childGroup.displayName = displayName;
                eGroup.controls[key] = this.buildFormEDM(value, childGroup, displayName); //递归 
            }
            else if (value != null && ((isResources && !isManyToMany) || (isJsonWithConstructor && Array.isArray(value)))) {
                let eArray = eGroup.controls[key] = new EArray();
                eArray.$parent = eGroup;
                eArray.metadatas = metadatas;
                (eArray as EArray).validators = new BehaviorSubject(validators);
                (value as any[]).forEach(v => {
                    let childGroup = new EGroup();
                    childGroup.$parent = eArray;
                    (eArray as EArray).controls.push(this.buildFormEDM(v, childGroup)); // array 没有 parent display name 的概念
                });
            }
            else {
                let eControl = new EControl({
                    defaultValue: value,
                    validators: new BehaviorSubject(validators),
                    metadatas: metadatas,
                    $parent: eGroup,
                    displayName: displayName
                });
                eGroup.controls[key] = eControl;
            }
        });

        // 处理 Compare Validation, 这个特别麻烦因为它涉及到 2 个 eControl (需要另一个的 display name)
        // 必须等到 2 个 eControl 都好了才能处理. 所以在这个环节才处理它.
        Object.keys(eGroup.controls).forEach(key => {
            let eControl = eGroup.controls[key];
            if (eControl instanceof EControl) {
                let compareMetadata = eControl.getMetadata(METADATA_KEY.Compare) as CompareMetadata;
                if (compareMetadata) {
                    let validators = eGroup.validators.value;
                    let linkToDisplayName = (eControl.$parent as EGroup).get(compareMetadata.linkTo)!.displayName;
                    eGroup.validators.next([
                        ...validators,
                        { name: 'compare', validatorFn: this.v.compare(key, compareMetadata.linkTo, linkToDisplayName, compareMetadata.type) }
                    ]);
                }
            }
        });
        return eGroup;
    }

    buildNgForm(edm: EGroup): FormGroup {
        return this.buildNgControl(edm) as FormGroup;
    }

    easyBuildNgForm(resource: any): FormGroup {
        const edm = this.buildFormEDM(resource);
        return this.buildNgForm(edm);
    }

    buildNgControl(edm: EAbstractControl): AbstractControl {
        let abstractControl: AbstractControl = undefined!;
        if (edm instanceof EGroup) {
            const keys = Object.keys(edm.controls);
            const formGroup = new FormGroup({});
            keys.forEach(key => {
                formGroup.addControl(key, this.buildNgControl(edm.controls[key])); //递归
            });
            abstractControl = formGroup;
        }
        else if (edm instanceof EArray) {
            let formArray = new FormArray(edm.controls.map(v => this.buildNgControl(v))); //递归           
            abstractControl = formArray;
        }
        else if (edm instanceof EControl) {
            let formControl = new FormControl(edm.defaultValue);
            abstractControl = formControl;
        }
        edm.validators.subscribe(validators => {
            abstractControl.setValidators(validators.map(v => v.validatorFn));
            abstractControl.updateValueAndValidity();
        });
        return abstractControl;
    }
}
