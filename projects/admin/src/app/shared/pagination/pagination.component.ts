import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AbstractPaginationComponent } from '../../../../../stooges/src/public_api';

@Component({
  selector: 'cp-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent extends AbstractPaginationComponent {

  constructor(
  ) {
    super();
  }

}

