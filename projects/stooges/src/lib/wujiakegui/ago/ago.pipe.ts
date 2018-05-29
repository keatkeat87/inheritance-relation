import { LanguageService } from '../../language/language.service';
import { Pipe, PipeTransform } from '@angular/core';
// import * as moment from 'moment';
import * as momentNs from 'moment';
const moment = momentNs;

@Pipe({
    name: 'sAgo'
})
export class AgoPipe implements PipeTransform {

    constructor(
        private languageService: LanguageService
    ) { }

    transform(date: Date): string {
        const language = this.languageService.match({
            'en-US' : 'en-US',
            'zh' : 'zh-CN'
        });
        return moment(date).locale(language).fromNow();
    }
}
