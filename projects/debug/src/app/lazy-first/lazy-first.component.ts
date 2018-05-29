import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MyPreloadStrategyService } from '../my-preload-strategy.service';

@Component({
  selector: 'app-lazy-first',
  templateUrl: './lazy-first.component.html',
  styleUrls: ['./lazy-first.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyFirstComponent implements OnInit {

  constructor(
    private preload: MyPreloadStrategyService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.preload.load('lazy-first-child');
    }, 5000);

  }

}
