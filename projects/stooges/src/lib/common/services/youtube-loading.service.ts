import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YoutubeLoadingService {

  constructor() { }

  loading$ = new BehaviorSubject<boolean>(false);
  private count = 0;

  start() {
    this.count++;
    if (!this.loading$.value) this.loading$.next(true);
  }

  end() {
    this.count--;
    if (this.count == 0) this.loading$.next(false);
  }
}
