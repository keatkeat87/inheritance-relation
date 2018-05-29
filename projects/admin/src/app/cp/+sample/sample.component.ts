import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Sample, SampleService } from '../../entities/Resource';

import { 
  fadeInAnimation,
  StoogesAppComponent,
  YoutubeLoadingService,
  QueryParams, 
  ResourceStream,
  MatCPTableConfig,
  MAT_CP_TABLE_CONFIG,
  TableService,
  MatAbstractCPTableComponent,
  MatConfirmDialogService,
  TableSetting
} from '../../../../../stooges/src/public_api';


type ResourceType = Sample;

/*
  export class Form {
    branchId: number | null = null;
  }
*/

@Component({
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class SampleComponent extends MatAbstractCPTableComponent<ResourceType> implements OnInit {

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    cdr: ChangeDetectorRef,
    youtubeLoading: YoutubeLoadingService,
    private sampleService: SampleService,
    confirmService: MatConfirmDialogService,
    stoogesAppComponent: StoogesAppComponent,
    private tableService: TableService,
    @Inject(MAT_CP_TABLE_CONFIG) tableConfig: MatCPTableConfig 
  ) {
    super(activatedRoute, router, cdr, youtubeLoading, sampleService, confirmService, stoogesAppComponent, tableConfig);
  }

  protected getResourcesStream(queryParams: QueryParams): ResourceStream<ResourceType[]> {
    if (this.sort == 'date') {
      const desc = ((this.desc) ? ' desc' : '');
      queryParams['$orderby'] = `date${desc},Id${desc}`;
    }

    /*
      let filters: string[] = [];
      let formValue = this.form.value as Form;

      if (formValue.branchId) {
        filters.push(`branchId eq ${formValue.branchId}`);
      }
      if (filters.length) {
        let filter = `(${ filters.map(v => `(${v})`).join(' and ') })`;
        queryParams['$filter'] = (queryParams['$filter']) ? filter + ' and ' + queryParams['$filter'] : filter;
      }
    */
    queryParams['$select'] = 'Id,title_en,images,sort,category,SKU';
    queryParams['$expand'] = 'category';
    return this.sampleService.queryWatch(queryParams);
  }


  /*
    private submit() {
      this.patchQueryParams({ filter: JSON.stringify(this.form.getRawValue()) });
    }

    form: FormGroup
    eGroup : any
  */
  async ngOnInit() {

    /*
      this.eGroup = this.formService.buildFormEDM(new Form());
      this.form = this.formService.buildNgForm(this.eGroup);

      this.activatedRoute.queryParamMap.subscribe(queryParamMap => {
        let filterJson = queryParamMap.get('filter');
        let formValue = (filterJson) ? JSON.parse(filterJson) : new Form();
        this.form.setValue(formValue);
      });

      this.form.get('branchId')!.valueChanges.subscribe((v) => {
        this.submit();
      });
    */

    let resource = new Sample();
    this.keyAndTControls = this.tableService.generateTControls(resource);
    this.displayedColumns = [];
    this.generateRowNgClassFn = (resource) => {
      return {
        highlight: !resource.Id
      }
    }

    this.setting = new TableSetting({
      rowPerPage: 10,
      sort: 'sort',
      desc: false,
      search: {
        string: [],
        number: [],
        date: []
      }
    });

    this.startup();
  }


}



