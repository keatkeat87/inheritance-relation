
import { Injectable } from '@angular/core';
import { createAndAppendScriptAsync } from '../../../common/methods/create-and-append-script';

@Injectable({
  providedIn: 'root'
})
export class CkeditorService {

  constructor(
  ) { }

  private loadScriptPromise: Promise<void>;

  async loadScriptAsync() {
    if (this.loadScriptPromise) return this.loadScriptPromise;

    let path = window['CKEDITOR_BASEPATH'] = '/assets/stooges/js/ckeditor/';
    this.loadScriptPromise = createAndAppendScriptAsync(path + 'ckeditor-4.7.2.js');
    return this.loadScriptPromise;
  }
}
