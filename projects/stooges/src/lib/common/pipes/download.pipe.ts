import { APIServerConfig } from '../services/api-server-config';
import { API_SERVER_CONFIG } from '../services/api-server-config';
import { Pipe, PipeTransform, Inject } from '@angular/core';
import { UploadedPathService } from '../services/uploaded-path.service';
import { SFile } from '../../models/File';

@Pipe({
    name: 'sDownload'
})
export class DownloadPipe implements PipeTransform {

    constructor(
        private uploadedPathService: UploadedPathService,
        @Inject(API_SERVER_CONFIG) private APIServerConfig: APIServerConfig
    ) { }

    transform(file: SFile): string {
        if (file == null) return '';
        // 由于后台定义了 "能 download 的 file 一定是在 uploadedFiles 里面"
        // 而前端只要是 uploadedFiles , file.src 就会有 '/uploadFiles/'
        // 然后呢后端的接口又只能接受一个 name without '/uploadFiles/' 所以我们必须在这里过滤掉这个 '/uploadFiles/'
        const name = this.uploadedPathService.pathToName(file.src);
        return `${this.APIServerConfig.path}/download-file?name=${encodeURIComponent(name)}&display=${encodeURIComponent(file.name)}`;
    }
}
