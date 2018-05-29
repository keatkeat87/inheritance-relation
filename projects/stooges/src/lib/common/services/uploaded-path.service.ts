import { Injectable, Inject } from '@angular/core';
import { UPLOADED_PATH_CONFIG, UploadedPathConfig } from './uploaded-path-config';

@Injectable({
  providedIn: 'root'
})
export class UploadedPathService {

  constructor(
    @Inject(UPLOADED_PATH_CONFIG) private config: UploadedPathConfig,
  ) { }

  nameToPath(name: string): string {
    return this.config.uploadedFilesPath + '/' + name;
  }

  pathToName(path: string): string {
    return path.substring(`${this.config.uploadedFilesPath}/`.length);
  }

  private getImageSrcFromHtml(html: string): string[] {
    const rex = /<[img|amp\-img][^>]+src=["|']([^"|'>]+)/g;
    const paths: string[] = [];
    let match : RegExpExecArray | null = null;
    while (match = rex.exec(html)) {
      paths.push(match[1]);
    }
    return paths;
  }

  // for diplay
  ckeditorNameToPath(html: string): string {
    const paths = this.getImageSrcFromHtml(html);
    const prefix = this.config.uploadedFilesPath + '/';
    paths.distinct().forEach(path => {
      if (!path.startsWith('http')) {
        const regex = new RegExp(path, 'g');
        html = html.replace(regex, prefix + path);
      }
    });
    return html;
  }

  // for insert
  ckeditorPathToName(html: string): string {
    const paths = this.getImageSrcFromHtml(html);
    const prefix = this.config.uploadedFilesPath + '/';
    paths.distinct().forEach(path => {
      if (path.startsWith(prefix)) {
        const regex = new RegExp(path, 'g');
        html = html.replace(regex, path.substring(prefix.length));
      }
    });
    return html;
  }
}
