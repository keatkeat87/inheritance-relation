import { trigger, state, animate, transition, style, AnimationTriggerMetadata } from '@angular/animations';

export const slideLeftLeftAnimation : AnimationTriggerMetadata =
  trigger('slideLeftLeft', [
    state('*', style({
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      boxShadow: '1px 0 0 #fff',
      zIndex: 10
    })),
    transition(':enter', [
      style({
        left: '-100%',
        overflow: 'hidden'
      }),
      animate('.5s ease-in', style({
        left: 0
      }))
    ]),
    transition(':leave', [
      style({
        overflow: 'hidden'
      }),
      animate('.5s ease-in', style({
        left: '-100%',
      }))
    ])
  ]);
