import { YoutubeLoadingService } from '../../common/services/youtube-loading.service';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { trigger, state, animate, transition, style } from '@angular/animations';

@Component({
  selector: 'youtube-loading',
  templateUrl: './youtube-loading.component.html',
  styleUrls: ['./youtube-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('youtubeLoadingAnimation', [
      state('true', style({
        width: '80%', opacity: 1, visibility: 'visible'
      })),
      state('false', style({
        width: 0, opacity: 0, visibility: 'hidden'
      })),
      transition('0 => 1', [
        style({ width: 0, opacity: 1, visibility: 'visible' }),
        animate('2s ease-out', style({ width: '80%' }))
      ]),
      transition('1 => 0', [
        animate(100, style({ width: '100%' }))
      ])
    ])
  ]
})
export class YoutubeLoadingComponent implements OnInit {

  constructor(
    private youtubeLoadingService : YoutubeLoadingService,
    private cdr : ChangeDetectorRef
  ) { }
  
  isShow: boolean;
  
  ngOnInit() {
    this.youtubeLoadingService.loading$.subscribe(isShow => {
      this.isShow = isShow;
      this.cdr.markForCheck();
    });
  }
}
