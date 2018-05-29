import { animate, keyframes, query, state, style, transition, trigger, AnimationTriggerMetadata } from '@angular/animations';

export const popupAnimation : AnimationTriggerMetadata =
    trigger('popup', [
        state('false', style({
            display: 'none'
        })),
        transition('0 => 1', [
            query('.wrap', [
                animate(300, keyframes([
                    style({ transform: 'scale(0)', offset: 0 }),
                    style({ transform: 'scale(1.05)', offset: 0.45 }),
                    style({ transform: 'scale(0.95)', offset: 0.8 }),
                    style({ transform: 'scale(1)', offset: 1 })
                ]))
            ])
        ]),
        transition('1 => 0', [
            query('.wrap', [
                animate(300, keyframes([
                    style({ transform: 'scale(1)', offset: 0 }),
                    style({ transform: 'scale(1.05)', offset: 0.45 }),
                    style({ transform: 'scale(0.95)', offset: 0.8 }),
                    style({ transform: 'scale(0)', offset: 1 })
                ]))
            ])
        ])
    ]);
