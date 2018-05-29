import { LanguageService } from '../../language/language.service';
import { GoogleMapConfig, GOOGLE_MAP_CONFIG } from './google-map-config';
import { Inject, Injectable } from '@angular/core';
import { createAndAppendScriptAsync } from '../../common/methods/create-and-append-script';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {

  constructor(
    private languageService: LanguageService,
    @Inject(GOOGLE_MAP_CONFIG) private config: GoogleMapConfig,
  ) { }

  private loadScriptPromise: Promise<void>;

  async loadScriptAsync() : Promise<void> {
    if (this.loadScriptPromise) return this.loadScriptPromise;
    this.loadScriptPromise = new Promise<void>((resolve) => {
      window['googleMapInit'] = () => {
        resolve();
      };
      // https://developers.google.com/maps/faq#languagesupport
      const language = this.languageService.match({
        'en-US': 'en',
        'zh': 'zh-CN'
      });
      createAndAppendScriptAsync(`https://maps.googleapis.com/maps/api/js?key=${this.config.apiKey}&callback=googleMapInit&language=${language}`);
    });
    return this.loadScriptPromise;
  }
}
