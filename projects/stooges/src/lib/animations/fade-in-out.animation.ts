import { trigger, animate, transition, style, AnimationTriggerMetadata } from '@angular/animations';

export const fadeInOutAnimation: AnimationTriggerMetadata =
    trigger('fadeInOut', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('0.6s', style({ opacity: 1 }))
        ]),
        transition(':leave', [
            style({ opacity: 1 }),
            animate('0.6s', style({ opacity: 0 }))
        ])
    ]);
