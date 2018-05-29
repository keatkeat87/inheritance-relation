import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, debounceTime, startWith, distinctUntilChanged, skip, pairwise } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatCPTableConfig } from './cp-table-config';
import { Entity, QueryParams } from '../../../types';
import { AbstractTableComponent } from '../../table/abstract-table.component';
import { YoutubeLoadingService } from '../../../common/services/youtube-loading.service';
import { StoogesAppComponent } from '../../../stooges-app/stooges-app.component';
import { AbstractResourceService } from '../../../entity/services/abstract-resource.service';
import { isValidDate } from '../../../common/methods/is-valid-date';
import { toOdataSpecialCharacter } from '../../../common/methods/to-odata-special-character';
import { MatConfirmDialogService, MatConfirmDialogResult } from '../confirm-dialog/confirm.service';
import { KeyAndTControl } from '../../table/types';
import { MatTableGenerateRowNgClassFn } from './types';
import { Observable } from 'rxjs';

/*
   future : 
   以后可能会实现让用户自定义 displayColumns
   到时就可以不需要 language 的概念的

   note :   
   KeyAndTControl.key 对应 resource 的 key 
   KeyAndTControl.namespace + '.' + KeyAndTControl.key 对应 material display column 的 key 
   namespace 用于 entity 含有继承概念
*/
export abstract class MatAbstractCPTableComponent<ResourceType extends Entity> extends AbstractTableComponent<ResourceType> {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    cdr: ChangeDetectorRef,
    youtubeLoading: YoutubeLoadingService,
    /**
     * use for delete and update sort
     */
    protected resourceService: AbstractResourceService<ResourceType>,
    protected confirmDialogService: MatConfirmDialogService,
    stoogesAppComponent: StoogesAppComponent,
    protected tableConfig: MatCPTableConfig
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, stoogesAppComponent);
  }

  // 要特别就 override
  protected async confirmBeforeRemoveAsync(_resource: ResourceType): Promise<MatConfirmDialogResult> {
    return this.confirmDialogService.confirmAsync('Confirm remove ?');
  }

  dataSource: Observable<ResourceType[] | undefined[]> = this.resources$.pipe(map(resources => {
    if (!resources) return [];
    if (resources.length == 0) {
      return [undefined]; // 表示 not found
    }
    else {
      return resources; // 以后看怎样扩展 footer sum 
    }
  }));

  displayedColumns: string[]
  keyAndTControls: KeyAndTControl[]
  generateRowNgClassFn: MatTableGenerateRowNgClassFn<ResourceType>

  search = new FormControl('');
  private defaultLanguage: string;
  supportedLanguage: string[]
  language = new FormControl(this.defaultLanguage);

  // 有 link 的话, search key 会被 convert to currect language 
  // 比如外面写 'title_en' 但是 language 是 cn, 那么 会变成 search 'title_cn'
  protected searchLinkWithLanguage = true;
  protected displayColumnsLinkWithLanguage = true;

  // override
  startup() {
    this.defaultLanguage = this.tableConfig.defaultLanguage;
    this.supportedLanguage = this.tableConfig.supportedLanguages;

    let setDisplayColumnsByLanguage = (from: string, to: string) => {
      if (from == to || !this.displayColumnsLinkWithLanguage) return;
      from = '_' + from;
      to = '_' + to;
      this.displayedColumns = this.displayedColumns.map(v => {
        return (v.endsWith(from)) ? v.replace(from, to) : v;
      });
    }

    this.queryParamKeysForAjax.push('search');
    if (this.searchLinkWithLanguage) this.queryParamKeysForAjax.push('language');

    this.activatedRoute.queryParamMap.subscribe(queryParamMap => {     
      this.search.setValue(queryParamMap.get('search') || '');
      this.language.setValue(queryParamMap.get('language') || this.defaultLanguage);
      this.cdr.markForCheck();
    });

    this.activatedRoute.queryParamMap.pipe(pairwise()).subscribe(([prev, curr]) => {
      let from = prev.get('language') || this.defaultLanguage;
      let to = curr.get('language') || this.defaultLanguage;
      setDisplayColumnsByLanguage(from, to);
    });

    // search value change
    this.search.valueChanges.pipe(
      debounceTime(500),
      startWith(this.search.value),
      distinctUntilChanged(),
      skip(1)
    ).subscribe(v => {
      if (v == '') v = null;
      this.patchQueryParams({ search: v });
    });

    this.language.valueChanges.subscribe(v => {
      if (this.searchLinkWithLanguage) {
        if (!this.search.value) {
          this.queryParamKeysForAjax.remove(v => v == 'language');
        }
        else {
          this.queryParamKeysForAjax.push('language');
        }
      }
      if (v == this.defaultLanguage) v = null;
      this.patchQueryParams({ language: v });
    });

    setDisplayColumnsByLanguage(this.defaultLanguage, this.language.value);
    super.startup();
  }

  // override
  buildQueryParams() : QueryParams {
    let queryParams = super.buildQueryParams();
    const search = this.search.value;
    if (search != '') {
      const $filters: string[] = [];
      let strings = this.setting.search!.string;
      if (strings) {
        if (this.searchLinkWithLanguage) {
          strings = strings.map(v => {
            if (v.endsWith('_' + this.defaultLanguage)) {
              return v.replace('_' + this.defaultLanguage, '_' + this.language.value);
            }
            return v;
          })
        }
        
        strings.forEach(s => {
          $filters.push(`contains(${s},'${toOdataSpecialCharacter(search)}')`);
        });
      }

      let finalSearch = search;
      const firstChar = search.charAt(0);
      if (firstChar == '>' || firstChar == '<') finalSearch = search.substring(1);
      let operator = 'eq';
      if (firstChar == '>') operator = 'ge';
      if (firstChar == '<') operator = 'le';

      const numbers = this.setting.search!.number;
      if (numbers && !isNaN(finalSearch as any)) {
        numbers.forEach(n => {
          $filters.push(`${n} ${operator} ${finalSearch}`);
        });
      }

      const dates = this.setting.search!.date;
      if (dates && isValidDate(new Date(finalSearch)) && finalSearch.length >= 4) {
        dates.forEach(d => {
          $filters.push(`${d} ${operator} ${new Date(finalSearch).toDateString()}`);
        });
      }
      queryParams['$filter'] = `(${$filters.join(' or ')})`;
      console.log('final filters', $filters);
    }
    return queryParams;
  }


  // sort
  /*
      sample :
      <td
      [draggable]="sort == 'sort' && !updatingSort"
      [sDragover]="draggingData && !updatingSort"
      (dragstart)="recordDragStart(data)"
      (dragenter)="draggingData && !updatingSort && moveSort(data)"
      (dragend)="draggingData && !updatingSort && updateSort()"
      >{{ data.sort }}</td>
  */
  draggingData: ResourceType | null;
  private lastMoveSortIndex: number | null;
  private draggingDatasPositionCache: ResourceType[] = [];
  recordDragStart(data: ResourceType) {
    this.draggingData = data;
    this.draggingDatasPositionCache = [...this.resources] as ResourceType[]; //记入 position
  }
  moveSort(b: ResourceType, index: number) {
    const a = this.draggingData;
    if (a == b) {
      //skip
    }
    else {
      const iposA = this.resources.indexOf(a!);
      const iposB = this.resources.indexOf(b);
      this.resources.splice(iposA, 1);
      this.resources.splice(iposB, 0, a!);
      this.lastMoveSortIndex = index; //记入最后的 position
      this.resourcesSubject.next(this.resources);
    }
  }

  private _updatingSort: boolean;
  get updatingSort() {
    return this._updatingSort;
  }
  set updatingSort(isUpdatingSort) {
    this._updatingSort = isUpdatingSort;
    if (this.youtubeLoading) {
      if (isUpdatingSort) {
        this.youtubeLoading.start();
      }
      else {
        this.youtubeLoading.end();
      }
    }
  }

  async updateSort() {
    if (this.lastMoveSortIndex != null) {
      const a = this.draggingData;
      const b = this.draggingDatasPositionCache[this.lastMoveSortIndex];
      this.updatingSort = true;
      await this.resourceService.changeSortAsync(a!['sort'], b['sort']).catch(() => {
        this.resources = [...this.draggingDatasPositionCache]; //失败就还原
      });
      this.updatingSort = false;
      this.cdr.markForCheck();
    }
    this.draggingData = this.lastMoveSortIndex = null;
  }


  // delete
  private _deletingResource: boolean;
  get deletingResource() {
    return this._deletingResource;
  }
  set deletingResource(isDeletingResource) {
    this._deletingResource = isDeletingResource;
    if (this.youtubeLoading) {
      if (isDeletingResource) {
        this.youtubeLoading.start();
      }
      else {
        this.youtubeLoading.end();
      }
    }
  }

  // 因为用户操作很快, enter 的时候 popup 还没有出来, 而点击会造成 focus remove button
  // entry 就会触发 2 次, 所以要在这里阻挡
  private removeLock = false;
  async remove(resourceId: number) {
    if (!this.removeLock) {
      this.removeLock = true;
      const resource = this.resources.find(r => r.Id == resourceId)!;
      const result = await this.confirmBeforeRemoveAsync(resource);
      this.removeLock = false;
      if (result == 'ok') {
        this.deletingResource = true;
        await this.resourceService.deleteAsync(resourceId).catch(() => { });
        this.deletingResource = false;
        this.cdr.markForCheck();
      }
    }
  }
}
