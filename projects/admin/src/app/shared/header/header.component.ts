import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CPComponent } from '../../cp/cp.component';

@Component({
  selector: 'cp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  @Input()
  name: string;

  @Output('refresh')
  refreshEmitter = new EventEmitter<void>();

  constructor(
    private controlPanelComponent: CPComponent
  ) { }

  openSlideNav(){
    this.controlPanelComponent.sideNavOpen();
  }

  ngOnInit() {
  }

}
