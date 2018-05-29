import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SampleService, Sample } from '../../../entities/Resource';
import { SampleComponent } from '../sample.component';
import { AbstractSimplePutFormComponent } from '../../simple-form/abstract-simple-put-form.component';
import { FormService, fadeInAnimation } from '../../../../../../stooges/src/public_api';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class SamplePutFormComponent extends AbstractSimplePutFormComponent<Sample> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    sampleService: SampleService,
    activatedRoute: ActivatedRoute,
    router: Router,
    edmFormService: FormService,
    sampleComponent: SampleComponent
  ) {
    super(cdr, sampleService, activatedRoute, router, edmFormService, sampleComponent);
  }

  async ngOnInit() {
    this.displayKeys = ['question_en', 'question_cn', 'answer_en', 'answer_cn'];
    super.ngOnInit();
  }

}



