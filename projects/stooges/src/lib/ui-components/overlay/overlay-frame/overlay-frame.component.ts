import {
  Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Input, Output, EventEmitter
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

const ANIMATION_TIMINGS = '300ms cubic-bezier(0.25, 0.8, 0.25, 1)';
export interface OverlayFrameAnimationEvent { toState: string; fromState: string; }

@Component({
  selector: 's-overlay-frame',
  templateUrl: './overlay-frame.component.html',
  styleUrls: ['./overlay-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[@slideContent]': 'animationState',
    '(@slideContent.done)': 'onAnimationDone($event)'
  },
  animations: [
    trigger('slideContent', [
      state('void', style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })),
      state('enter', style({ transform: 'none', opacity: 1 })),
      state('leave', style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })),
      transition('* => *', animate(ANIMATION_TIMINGS)),
    ])
  ]
})
export class OverlayFrameComponent implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  @Input()
  showClose: boolean;

  @Output('animationLeave')
  animationLeaveEmiter = new EventEmitter<void>();

  animationState: 'void' | 'enter' | 'leave';

  ngOnInit() {
    this.animationState = 'enter';
  }

  onAnimationDone(e: OverlayFrameAnimationEvent) {
    if (e.toState == 'leave') {
      this.animationLeaveEmiter.emit();
    }
  }

  public animationLeave() {
    this.animationState = 'leave';
    this.cdr.markForCheck();
  }

  close() {
    this.animationLeave();
  }

}
