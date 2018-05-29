import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Sample, SampleService } from '../../../entities/Resource';
import { AbstractSimplePostFormComponent } from '../../simple-form/abstract-simple-post-form.component';

import { fadeInAnimation, FormService } from '../../../../../../stooges/src/public_api';

@Component({
  templateUrl: '../../simple-form/simple-form.component.html',
  styleUrls: ['../../simple-form/simple-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInAnimation]
})
export class SamplePostFormComponent extends AbstractSimplePostFormComponent<Sample> implements OnInit {

  constructor(
    cdr: ChangeDetectorRef,
    sampleService: SampleService,
    edmFormService: FormService
  ) {
    super(cdr, sampleService, edmFormService);
  }

  ngOnInit() {
    this.displayKeys = ['question_en', 'question_cn', 'answer_en', 'answer_cn'];
    this.resourceConstructor = Sample;
    super.ngOnInit();
  }
}


