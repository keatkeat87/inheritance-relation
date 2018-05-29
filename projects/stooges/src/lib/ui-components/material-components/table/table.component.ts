import { fnValue } from '../../../common/methods/fn-value';
import { Component, OnInit, ChangeDetectionStrategy, Input, TrackByFunction, Output, EventEmitter, AfterContentInit, ContentChildren, QueryList, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable ,  Subscription } from 'rxjs';
import { SortDirection, MatColumnDef, MatRowDef, MatTable } from '@angular/material';
import { ImageService } from '../../../common/services/image.service';
import { Entity } from '../../../types';
import { getByPath } from '../../../common/methods/get-by-path';
import { SImage } from '../../../models/Image';
import { KeyAndTControl } from '../../table/types';
import { MatTableGenerateRowNgClassFn, MatTableEntityItem } from './types';
import { odataType } from '../../../entity/types';
import { getClassNameFromOdatTypeResource } from '../../../entity/get-class-name-from-odata-type-resource';


@Component({
  selector: 's-mat-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatTableComponent implements OnInit, AfterContentInit, OnDestroy {

  constructor(
    private cdr: ChangeDetectorRef,
    private imageService: ImageService
  ) { }
 

  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
  @ContentChildren(MatRowDef) rowDefs: QueryList<MatRowDef<Entity>>;
  @ViewChild(MatTable) matTable: MatTable<Entity>;
  ngAfterContentInit() {
    // note : 
    // mat 并不聪明，没有办法直接处理 ng-content, 需要自己手动 register    
    // refer : 
    // https://github.com/angular/material2/tree/master/src/demo-app/table/custom-table
    // https://github.com/angular/material2/issues/6980    
    this.columnDefs.forEach(columnDef => this.matTable.addColumnDef(columnDef));
    this.rowDefs.forEach(rowDef => this.matTable.addRowDef(rowDef));
  }

  @Input()
  hideRemove: boolean = false;

  @Input()
  hideEdit: boolean = false;

  @Input()
  showDrag: boolean = false;

  private _displayedColumns: string[]
  get displayedColumns() {
    return this._displayedColumns;
  }
  @Input()
  set displayedColumns(value) {
    this._displayedColumns = [...value];
    if (this.showDrag) this._displayedColumns.unshift('drag');
    if (!this.hideEdit) this._displayedColumns.push('edit');
    if (!this.hideRemove) this._displayedColumns.push('remove');
  }

  @Input()
  dataSource: Observable<Entity[]>

  @Input()
  trackBy: TrackByFunction<Entity> = (index: number, item: Entity) => {
    if (!item) return index;
    return item.Id;
  }

  @Input()
  sort: string

  @Input()
  sortDirection: SortDirection

  @Output('sortChange')
  sortChangeEmitter = new EventEmitter<string>();

  @Input()
  keyAndTControls: KeyAndTControl[];

  @Input()
  cellDraggable: boolean

  @Output('cellDragstart')
  cellDragstartEmitter = new EventEmitter<{ resource: Entity }>();

  @Output('cellDragend')
  cellDragendEmitter = new EventEmitter<void>();

  @Output('remove')
  removeEmitter = new EventEmitter<{ resource: Entity }>();

  @Input()
  draggingData: Entity
 
  @Input()
  generateRowNgClassFn: MatTableGenerateRowNgClassFn<Entity>
 
  @Input()
  selectedEntityItem : MatTableEntityItem

  onSortChange(sortKey: string) {
    // 如果有处理继承情况, 要把 namespace 拿掉哦
    if (this.selectedEntityItem) sortKey = sortKey.split('.').slice(1).join('.');
    this.sortChangeEmitter.emit(sortKey);
  }

  generateEditRouterLink(resource: Entity): string[] {
    let editPath = 'edit';
    if (this.selectedEntityItem) {
      let className: string;
      if (resource[odataType]) {
        className = getClassNameFromOdatTypeResource(resource).toLowerCase();
      }
      else {
        className = this.selectedEntityItem.class.name.toLowerCase()
      }
      editPath += '-' + className;
    }
    return [resource.Id.toString(), editPath];
  }

  internalGenerateRowNgClassFn: MatTableGenerateRowNgClassFn<Entity> = (resource, index) => {
    let result = {};
    if (this.generateRowNgClassFn) result = {
      ...result,
      ...this.generateRowNgClassFn(resource, index)
    }
    if (this.showDrag) result = {
      ...result,
      ...{ onDrag: resource === this.draggingData }
    }
    return result;
  }

  @Input()
  rowSDragover: boolean

  @Output('rowDragenter')
  rowDragenterEmitter = new EventEmitter<{ resource: Entity, index: number }>();

  getByPath(row: Entity, path: string): any {
    let value = getByPath(row, path);
    return Array.isArray(value) ? value[0] : value;
  }

  empty(_index: number, resource: Entity | undefined) {
    return !resource;
  }

  notEmpty(_index: number, resource: Entity | undefined) {
    return resource;
  }

  fnValue = fnValue;

  sub = new Subscription();

  getBiggestImageSrc(image : SImage) {
    let imageData =  this.imageService.getData(image.$metadata, image.width, image.height, image.src);
    return this.imageService.getBiggestDescription(imageData).src;
  }

  ngOnInit() {
    // note: mat table 不会 markForCheck when dataSource, 自己需要处理
    this.sub.add(
      this.dataSource.subscribe(_ => this.cdr.markForCheck())
    ); 
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
