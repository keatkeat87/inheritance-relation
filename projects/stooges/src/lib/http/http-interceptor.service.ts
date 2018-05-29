import { API_SERVER_CONFIG, APIServerConfig } from '../common/services/api-server-config';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor as NgHttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID, isDevMode } from '@angular/core';
import { Observable, from as fromPromise, throwError as _throw } from 'rxjs';
import { catchError, map, retryWhen, scan, delay } from 'rxjs/operators';
import { AlertService } from '../common/services/alert.service';

export type IdentityInterceptFn = (req: HttpRequest<any>) => HttpRequest<any>;

@Injectable()
export class HttpInterceptor implements NgHttpInterceptor {

    constructor(
        @Inject(LOCALE_ID) private locale: string,
        @Inject(API_SERVER_CONFIG) private APIServerConfig: APIServerConfig,
        private alertService: AlertService
    ) { }

    identityIntercept: IdentityInterceptFn | null;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let finalReq = req;
        const urlSegments = finalReq.url.split('/');
        const urlSegment = urlSegments[1];

        if (urlSegment == 'api' || urlSegment == 'OAuth') {
            urlSegments[0] = this.APIServerConfig.path;
            finalReq = finalReq.clone({
                url: urlSegments.join('/')
            });
        }

        if (typeof (this.identityIntercept) === 'function') {
            finalReq = this.identityIntercept(finalReq);
        }

        finalReq = finalReq.clone({
            headers: finalReq.headers.append('language', this.locale)
        });

        let result = next.handle(finalReq).pipe(
            // delay(200), //这里 delay 会影响触发事件的顺序，尤其是 observe 'events' 的时候, 不过 production 的时候是不可能会 delay 的，所以 development 时注意一下哦.
            map(httpEvent => {
                if (httpEvent instanceof HttpResponse) {
                    if (httpEvent.body && typeof (httpEvent.body) === 'object' && httpEvent.body['@odata.context']) {
                        const body = { ...httpEvent.body };
                        delete body['@odata.context'];
                        return httpEvent.clone<Object>({
                            body: body
                        });
                    }
                }
                return httpEvent;
            })
        );

        if (!isDevMode()) {
            result = result.pipe(retryWhen(errors => {
                // retry 3 times per second
                return errors.pipe(
                    scan((errorCount: number, err: HttpErrorResponse) => {
                        if (errorCount == 2 || err.status != 500) {
                            throw err;
                        }
                        return errorCount + 1;
                    }, 0), delay(1000));
            }))
        }

        result = result.pipe(catchError((errorResponse: HttpErrorResponse) => {
            // 是可以 json 的哦, 下次搞个 logger
            // console.log('response', JSON.stringify(errorResponse));
            // console.log('request', JSON.stringify(req));
            let alertPromise : Promise<void> | null = null;
            if (errorResponse.status == 0) {
                alertPromise = this.alertService.alertAsync('no network');
            }
            else if (errorResponse.status == 500) {
                const errorCode = errorResponse.error.error.message || errorResponse.error.error;
                let message = '';
                if (errorCode == 'concurrency') {
                    message = 'concurrency';
                }
                else if (errorCode == "stringLengthOver") {
                    message = 'text over database limit, please contact IT support.';
                }
                else if (errorCode == 'foreignKeyProtect') {
                    message = `can't remove due to the data have relationship with another data.`;
                }
                else if (errorCode == 'internalServerError') {
                    message = `server down, please refresh and retry`;
                }
                alertPromise = this.alertService.alertAsync(message);
            }
            else if (errorResponse.status == 401) {
                alertPromise = this.alertService.alertAsync('permission lost, it maybe due to logout from other device or someone changing your account permission or cache issue, please try refresh and relogin.');
            }
            else if (errorResponse.status == 400) {
                const errorCode = errorResponse.error.error.message || errorResponse.error.error;
                if (errorCode.startsWith('The query specified in the URI is not valid.')) {
                    alertPromise = this.alertService.alertAsync('getting data fail, please retry.');
                }
            }

            // 400 就交给外面处理吧, unique 是 400 哦
            if (alertPromise) {
                return fromPromise(alertPromise).pipe(map(() => {
                    throw errorResponse;
                }));
            }
            else {
                return _throw(errorResponse);
            }
        }));

        return result;
    }
}






