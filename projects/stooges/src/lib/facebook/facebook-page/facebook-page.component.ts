import { FacebookService } from '../facebook.service';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';

declare let FB: any;

@Component({
  selector: 's-facebook-page',
  templateUrl: './facebook-page.component.html',
  styleUrls: ['./facebook-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacebookPageComponent implements OnInit, AfterViewInit {

  constructor(
    private facebookService: FacebookService,
  ) { }
  
  ngOnInit() {

  }

  @Input()
  href : string

  @Input()
  smallHeader : boolean

  @Input()
  adaptContainerWidth : boolean

  @Input()
  hideCover : boolean

  @Input()
  showFacepile : boolean

  async ngAfterViewInit() {
    await this.facebookService.loadScriptAsync();
    FB.XFBML.parse(); 
  }

}
