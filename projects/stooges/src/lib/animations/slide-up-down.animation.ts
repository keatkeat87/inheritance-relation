import { trigger, state, animate, transition, style, AnimationTriggerMetadata } from '@angular/animations';

export const slideUpDownAnimation : AnimationTriggerMetadata =
  trigger('slideUpDown', [
    state('true', style({
      height: '*'
    })),
    state('false', style({
      height: 0
    })),
    transition('1 <=> 0', animate('300ms ease-in'))
  ]);
