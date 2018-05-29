import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Pipe({ name: 'sSafeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string) : SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
