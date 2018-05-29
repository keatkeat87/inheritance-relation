import { trigger, animate, transition, style, AnimationTriggerMetadata } from '@angular/animations';

export const fadeInAnimation : AnimationTriggerMetadata =
    trigger('fadeIn', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('0.6s', style({ opacity: 1 }))
        ])
    ]);
