import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { popupAnimation } from '../animations/popup.animation';
import { YoutubeLoadingService } from '../common/services/youtube-loading.service';
import { AlertService } from '../common/services/alert.service';
import { TitleMetaDescriptionService } from '../common/services/title-meta-description.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'stooges-app',
  templateUrl: './stooges-app.component.html',
  styleUrls: ['./stooges-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [popupAnimation]
})
export class StoogesAppComponent implements OnInit {

  isShowYoutubeLoading = false;
  refreshEmitter = new EventEmitter();

  constructor(
    private router: Router,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private titleMetaService: TitleMetaDescriptionService,
    private youtubeLoadingService: YoutubeLoadingService
  ) { }

  showAlertError = false;
  alertMessage = '';

  closeAlert() {
    this.showAlertError = false;
    this.alertService.onAlertClose$.next();
  }

  ngOnInit() {

    // title & meta
    this.titleMetaService.setup();

    // youtube loading when router change 
    this.router.events.pipe(filter(e => e instanceof NavigationStart || e instanceof NavigationEnd || e instanceof NavigationCancel)).subscribe(e => {
      if (e instanceof NavigationStart) {
        this.youtubeLoadingService.start();
      }
      if (e instanceof NavigationEnd || e instanceof NavigationCancel) {
        this.youtubeLoadingService.end();
      }
    });

    // display when alert 
    this.alertService.onAlert$.subscribe(message => {
      this.showAlertError = true;
      this.alertMessage = message;
      this.cdr.markForCheck();
    });
  }
}
