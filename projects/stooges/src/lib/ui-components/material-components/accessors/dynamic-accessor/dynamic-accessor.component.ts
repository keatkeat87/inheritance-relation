import { CompareWith } from '../../../../types';
import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSimpleSelectComponentGetValueOrDisplayFn } from '../simple-select/simple-select.component';
import { AbstractResourceService } from '../../../../entity/services/abstract-resource.service';
import { Entity } from '../../../../types';
import { valueToDisplay } from '../../../../common/methods/value-to-display';
import { EControl } from '../../../../entity/models/EControl';
import { EGroup } from '../../../../entity/models/EGroup';
import { METADATA_KEY } from '../../../../decorators/metadata-key';
import { EnumMetadata, EnumOption } from '../../../../decorators/Enum';
import { UrlTitleMetadata } from '../../../../decorators/UrlTitle';
import { ForeignKeyMetadata } from '../../../../decorators/ForeignKey';
import { ResourceMetadata } from '../../../../decorators/Resource';
import { ServiceMetadata } from '../../../../decorators/Service';
import { ForeignKeySelectMetadata } from '../../../../decorators/ForeignKeySelect';
import { ResourcesMetadata } from '../../../../decorators/Resources';
import { AccessorType } from '../types';

@Component({
  selector: 's-mat-dynamic-accessor',
  templateUrl: './dynamic-accessor.component.html',
  styleUrls: ['./dynamic-accessor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatDynamicAccessorComponent implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef,
    private injector: Injector
  ) { }

  @Input()
  eControl: EControl

  @Input('control')
  formControl: FormControl

  accessorType: AccessorType

  simpleSelectGetValue: MatSimpleSelectComponentGetValueOrDisplayFn
  simpleSelectGetDisplay: MatSimpleSelectComponentGetValueOrDisplayFn
  simpleSelectItems: any
  simpleSelectMultiple: boolean
  simpleSelectCompareWith: CompareWith<Entity>
  simpleSelectLoading: boolean

  urlTitle: string | null = null;

  async ngOnInit() {

    let has = (key: string) => {
      return this.eControl.hasMetadata(key);
    }

    let type = this.eControl.getMetadata(METADATA_KEY.Type);
    let enumMetadata = this.eControl.getMetadata(METADATA_KEY.Enum) as EnumMetadata;
    let foreignKeyMetadata = this.eControl.getMetadata(METADATA_KEY.ForeignKey) as ForeignKeyMetadata;
    let resourcesMetadata = this.eControl.getMetadata(METADATA_KEY.Resources) as ResourcesMetadata;

    if (has(METADATA_KEY.Email)) {
      this.accessorType = 'Email';
    }
    else if (has(METADATA_KEY.Date)) {
      this.accessorType = 'DatePicker';
    }
    else if (has(METADATA_KEY.Ckeditor)) {
      this.accessorType = 'Ckeditor';
    }
    else if (has(METADATA_KEY.Time)) {
      this.accessorType = 'TimePicker';
    }
    else if (has(METADATA_KEY.Textarea)) {
      this.accessorType = 'Textarea';
    }
    else if (has(METADATA_KEY.Image) || has(METADATA_KEY.File)) {
      this.accessorType = 'Upload';
    }
    else if (has(METADATA_KEY.LongText)) {
      this.accessorType = 'LongText';
    }
    else if (has(METADATA_KEY.Password)) {
      this.accessorType = 'Password';
    }
    else if (enumMetadata) {
      this.accessorType = 'SimpleSelect';
      this.simpleSelectItems = enumMetadata.items;
      this.simpleSelectMultiple = enumMetadata.multiple;
      this.simpleSelectGetValue = (item: EnumOption) => {
        return item.value;
      }
      this.simpleSelectGetDisplay = (item: EnumOption) => {
        return item.display || valueToDisplay(item.value);
      }
    }
    else if (foreignKeyMetadata) {
      let resourceMetadata = Reflect.getMetadata(METADATA_KEY.Resource, (this.eControl.$parent as EGroup).resource, foreignKeyMetadata.linkTo) as ResourceMetadata;
      let constructor = resourceMetadata.getConstructor();
      let serviceMetadata = Reflect.getMetadata(METADATA_KEY.Service, constructor) as ServiceMetadata;
      let foreignSelectMetadata = Reflect.getMetadata(METADATA_KEY.ForeignKeySelect, constructor) as ForeignKeySelectMetadata;
      let service = this.injector.get(serviceMetadata.getConstructor()) as AbstractResourceService<Entity>;

      this.accessorType = 'SimpleSelect';
      this.simpleSelectMultiple = false;
      this.simpleSelectGetValue = (item: Entity) => {
        return item.Id;
      }
      this.simpleSelectGetDisplay = (item: any) => {
        return item[foreignSelectMetadata.display];
      }
      this.simpleSelectLoading = true;
      this.simpleSelectItems = await service.queryAsync({ $orderby: foreignSelectMetadata.orderby });
      this.simpleSelectLoading = false;
      this.cdr.markForCheck();
    }
    else if (resourcesMetadata) {
      // 除了 many to many 不可能进来
      let constructor = resourcesMetadata.getConstructor();
      let serviceMetadata = Reflect.getMetadata(METADATA_KEY.Service, constructor) as ServiceMetadata;
      let foreignSelectMetadata = Reflect.getMetadata(METADATA_KEY.ForeignKeySelect, constructor) as ForeignKeySelectMetadata;
      let service = this.injector.get(serviceMetadata.getConstructor()) as AbstractResourceService<Entity>;

      this.accessorType = 'SimpleSelect';
      this.simpleSelectMultiple = true;
      this.simpleSelectCompareWith = (item1, item2) => {
        return item1.Id === item2.Id;
      }
      this.simpleSelectGetDisplay = (item: any) => {
        return item[foreignSelectMetadata.display];
      }
      this.simpleSelectLoading = true;
      this.simpleSelectItems = await service.queryAsync({ $orderby: foreignSelectMetadata.orderby });
      this.simpleSelectLoading = false;
      this.cdr.markForCheck();
    }
    else if (type === Number) {
      this.accessorType = 'Number';
    }
    else if (type === String) {
      let urlTitleMetadata = this.eControl.getMetadata(METADATA_KEY.UrlTitle) as UrlTitleMetadata;
      if (urlTitleMetadata) this.urlTitle = urlTitleMetadata.linkTo;
      this.accessorType = 'Text';
    }
    else if (type === Boolean) {
      this.accessorType = 'Checkbox';
    }
    else {      
      console.error('no accessor BUG!, type : ', type);
      console.log(this.eControl);
    }
  }

}
