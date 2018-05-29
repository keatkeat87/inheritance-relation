import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

// sample
// <iframe *ngIf="interest.youtubeCode" [src]="interest.youtubeCode | sYoutubeCode" frameborder="0" allowfullscreen></iframe>
@Pipe({
  name: 'sYoutubeCode'
})
export class YoutubeCodePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string) : SafeResourceUrl {
    if (value == null || value == '') return '';
    const yoututeFront = 'https://www.youtube.com/watch';
    const yoututeKey = 'v';
    let code = '';
    if (value.startsWith(yoututeFront)) {
      const ipos = value.indexOf('?');
      if (ipos != -1) {
        const params = value.substring(ipos + 1);
        const keyValues = params.split('&');
        for (const keyValue of keyValues) {
          const key = keyValue.split('=')[0];
          if (key == yoututeKey) {
            code = keyValue.split('=')[1];
            break;
          }
        }
      }
    }
    else {
      code = value;
    }
    const url = 'https://www.youtube.com/embed/' + code;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
