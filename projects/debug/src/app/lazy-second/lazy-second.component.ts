import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-lazy-second',
  templateUrl: './lazy-second.component.html',
  styleUrls: ['./lazy-second.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazySecondComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
