import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  alertAsync(message: string): Promise<void> {
    return new Promise<void>((resolve) => {
      this.onAlert$.next(message);
      this.onAlertClose$.pipe(take(1)).subscribe(_ => {
        resolve();
      });
    });
  }

  onAlert$ = new Subject<string>();
  onAlertClose$ = new Subject();

}
