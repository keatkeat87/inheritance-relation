import { EntityService } from '../entity/services/entity.service';
import { pairwise, filter, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';

import { HttpInterceptor } from '../http/http-interceptor.service';
import { HttpWatcher } from '../http/http-watcher.service';
import { IdentityConfig, IDENTITY_CONFIG } from './identity-config';
import { AlertService } from '../common/services/alert.service';
import { ResourceStream } from '../types';
import { timespan } from '../common/methods/timespan';
import { toNgHttpParams } from '../common/methods/to-ng-http-params';
import { User } from '../entity/entities/User';


/*
  note :
  最基层的概念是, c# 的 api 接口，会因为不同 selectedRole 而有不同的权限, 注：c# get accesstoken 是不处理 selectedRole 的, 只有 api 请求处理哦
  所以前端发请求时要带上 selectedRole params, 不带表示匿名
  我们通常以 page 来区分 role  , 比如  /admin, /teacher
  首页则比较特别, 会有匿名和 member
  /admin 所有的请求都以 admin role 发出
  首页以匿名发出, 登入后以 member 发出
  因为大部分请求都有 selectedRole, 所以有一个 global selectedRole 的概念，这样我们就不需要每个请求都写要用什么 role
  global 的 selectedRole 会在最上层的 component init 被设置, 比如 AdminComponent, TeacherComponent
  通过 http intercept 添加 global selectedRole, 这个 intercept 是在有登入的情况下才有的哦, 合理嘛, 还没有登入, 所有请求只能是匿名丫
  上面工作到很好, 但是如果有些请求要匿名就会比较麻烦
  我们需要在 request 上加一些变量来和 http intercept 沟通来取消 global selectedRole, 我们选了 params { anonymous : true } 来告诉 intercept 不要添加 global selectedRole
  但是 http intercept 只有登入情况下才会有, 所以我们这个 { anonymous : true } 在没有 intercept 介入的情况是直接送去 c# 的, 所以 c# 不能因为这个有任何 side effect 哦
  (之前就是因为我直接 set selectedRole : null 来取消 global, 结果 intercept 没跑, params 被传去 c# 后, c# 被影响了, 所以才换成了 anonymous : true)
  这个是唯一一个比较有隐患的问题啦，不过为了方便调用还是值得的
*/

// note :
// multiple tag condition, if user logout in other tag, when this tag send request or refreshToken will first check localStorage
// if found that already logout in other tag, then logout now and alert user. (due to we can't block the http request, so when request 401 then must be logout already)
// multiple device condition, user can logout all device, but not immediately, wait for next refreshToken, backend will fail the refresh then auto logout and alert user.

interface TokenInfo {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
    generateTime: number;
}

@Injectable({
    providedIn: 'root'
})
export class IdentityService {
    constructor(
        private http: HttpClient,
        @Inject(IDENTITY_CONFIG) private config: IdentityConfig,
        private httpWatcher: HttpWatcher,
        private entityService: EntityService,
        private httpInterceptor: HttpInterceptor,
        private alertService: AlertService
    ) { }

    user$ = new BehaviorSubject<User | null>(null);

    /** if already login, it won't trigger哦 */
    login$ : Observable<[User | null, User |null]> = this.user$.pipe(pairwise(), filter(([prev, curr]) => !!(!prev && curr)));
    logout$: Observable<[User | null, User |null]> = this.user$.pipe(pairwise(), filter(([prev, curr]) => !!(prev && !curr)));
    initDone$ = new ReplaySubject<void>();

    private userStream: ResourceStream<User> | null;

    getCharacter<T>(characterClass: any): T {
        return this.user.characters.find(c => c instanceof characterClass)! as any;
    }

    get user(): User {
        return this.user$.value!;
    }

    get hasLogged(): boolean {
        return !!this.user;
    }

    hasRole(role: string): boolean {
        if (!this.user) return false;
        return this.user.Roles.some(r => r.Name == role);
    }

    // call when router permission block
    // call when home page after page init
    // note 因为会 multi call, 所以做一个 cache 不要浪费
    private cache: Promise<void>;
    tryLoginByLocalStorageAsync(): Promise<void> {
        if (this.cache) return this.cache;
        this.cache = new Promise<void>(async (resolve, reject) => {
            try {
                const tokenInfo = this.getLocalStorage();
                if (tokenInfo) {
                    const now = +new Date();
                    const gap = now - tokenInfo.generateTime!;
                    const accessTokenActive = gap <= (tokenInfo.expires_in - 120) * 1000;
                    const refreshTokenActive = gap <= timespan.year(5);
                    if (accessTokenActive) {
                        await this.onNewTokenInfoAsync(tokenInfo);
                    }
                    else {
                        if (refreshTokenActive) {
                            await this.refreshTokenAsync();
                        }
                    }
                }
                resolve();
                this.initDone$.next(undefined);
                this.initDone$.complete();
            }
            catch (e) {
                reject(e);
            }
        });
        return this.cache;
    }

    private identityHttpInterceptFn = (req: HttpRequest<any>): HttpRequest<any> => {
        // 只针对 /api/ or /OAuth/ 路径自动加 accessToken
        // 如果 headers already have Authorization then skip
        // 如果当下的 localStorage 已经不存在, 表示再其它页面已经删除了

        let finalReq = req;
        const tokenInfo = this.getLocalStorage();
        if (!tokenInfo) {
            // already logout on other tag
            this.logout();
        }
        else {
            if (req.url.indexOf('/api/') != -1 || req.url.indexOf('/OAuth/') != -1) {
                if (!req.headers.has('Authorization')) {
                    finalReq = finalReq.clone({
                        headers: finalReq.headers.append('Authorization', `Bearer ${tokenInfo.access_token}`)
                    });
                }

                // 后台是不要 selectedRole = null 的, 如果匿名就不要传上去
                // 但是前台是用 selectedRole = null 来表示匿名, 所以有点乱啦.
                // 简单说后台认为 no selectedRole params 就是匿名 common sense
                // 前台我们有全局 config, 当 request 没有表面 selectedRole 时, 我们会使用 config
                // 那么如果我们就是想要匿名的话, 我们就非得写一个 null, 因为如果不写会自动放全局的丫.
                // 所以就有了下面这个移除策略咯...
                const hasSelectedRole = finalReq.params.has('selectedRole');
                if (hasSelectedRole) {
                    // 移除
                    if (finalReq.params.get('selectedRole') == null) {
                        finalReq = finalReq.clone({
                            params: finalReq.params.delete('selectedRole')
                        });
                    }
                }
                else {
                    // 自动添加
                    if (this.config.selectedRole != null) {
                        finalReq = finalReq.clone({
                            params: finalReq.params.append('selectedRole', this.config.selectedRole)
                        });
                    }
                }
            }
        }

        return finalReq;
    }

    private timeout: any;

    private getLocalStorage(): TokenInfo | null {
        const json = localStorage.getItem('tokenInfo');
        if (!json) return null;
        return JSON.parse(json);
    }

    private setRefreshTokenTimeout(tokenInfo: TokenInfo) {
        const targetTime = tokenInfo.generateTime! + ((tokenInfo.expires_in - 120) * 1000);
        const now = +new Date();
        const time = targetTime - now;
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            clearTimeout(this.timeout);
            this.refreshTokenAsync();
        }, time);
    }

    private clearUser() {
        this.userStream!.subscription.unsubscribe();
        this.userStream = null;
        this.user$.next(null);
    }

    private async refreshTokenAsync() {
        const headers = new HttpHeaders({
            'Authorization': 'Basic ' + btoa('123456' + ':' + 'abcdef'),
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        const tokenInfo = this.getLocalStorage()!;
        const body = toNgHttpParams({
            grant_type: 'refresh_token',
            refresh_token: tokenInfo.refresh_token
        }).toString();

        return await this.http.post<TokenInfo>('/OAuth/Token', body, { headers }).toPromise().then((tokenInfo) => {
            tokenInfo.generateTime = +new Date();
            return this.onNewTokenInfoAsync(tokenInfo);
        }).catch((e: HttpErrorResponse) => {
            if (e.status == 400 && e.error.error == 'allDeviceLogout') {
                this.logout();
                this.alertService.alertAsync('your account already logout from other device, please refresh and relogin.');
            }
            else if (e.status == 400 && e.error.error == 'blocked') {
                this.logout();
                this.alertService.alertAsync('your account has been blocked.');
            }
            else {
                this.alertService.alertAsync('server down, please refresh and retry.');
            }
        });
    }

    private async onNewTokenInfoAsync(tokenInfo: TokenInfo) {
        this.httpInterceptor.identityIntercept = this.identityHttpInterceptFn;
        localStorage.setItem('tokenInfo', JSON.stringify(tokenInfo));
        this.setRefreshTokenTimeout(tokenInfo);
        await this.updateUserAsync();
    }

    /**
     * @description Error<string> 'notFound' | 'needConfirmUser' | 'wrongPassword' | 'locked' | 'blocked'
     */
    async loginAsync(postData: { type: 'password' | 'byPass', username: string, password: string }) {
        // login 完成 user 就有了
        const headers = new HttpHeaders({
            'Authorization': 'Basic ' + btoa('123456' + ':' + 'abcdef'),
            'Content-Type': 'application/x-www-form-urlencoded',
            'login-type': postData.type,
        });

        const body = toNgHttpParams({
            grant_type: 'password',
            username: postData.username,
            password: postData.password,
            //scope: ''
        }).toString();
        const tokenInfo = await this.http.post<TokenInfo>('/OAuth/Token', body, { headers }).toPromise().catch((e: HttpErrorResponse) => {
            if (e.status == 400) throw e.error.error;
            throw e;
        });
        tokenInfo.generateTime = +new Date();
        await this.onNewTokenInfoAsync(tokenInfo).catch(e => {
            throw e;
        });
    }

    async logoutAsync({ allDevice = false } = {}): Promise<void> {
        if (allDevice) {
            await this.http.post(`/api/User.logout`, null).toPromise();
        }
        this.logout();
    }

    private logout() {
        this.httpInterceptor.identityIntercept = null;
        localStorage.removeItem('tokenInfo');
        clearTimeout(this.timeout);
        this.clearUser();
    }

    /**
     * @description Error<string> 'notFound' | 'needConfirmUser'
     */
    async forgotPasswordAsync(postData: { username: string }) {
        let options;
        if (this.hasLogged) options = { params: toNgHttpParams({ selectedRole: null }) };
        await this.http.post('/api/User.forgotPassword', postData, options).toPromise().catch((e: HttpErrorResponse) => {
            if (e.status == 400) throw e.error.error.message;
            throw e;
        });
    }

    /**
     * @description Error<string> 'expired' | 'notMatch'
     */
    async resetPasswordAsync(postData: { username: string, token: number, password: string }) {
        let options;
        if (this.hasLogged) options = { params: toNgHttpParams({ selectedRole: null }) };
        await this.http.post('/api/User.resetPassword', postData, options).toPromise().catch((e: HttpErrorResponse) => {
            if (e.status == 400) throw e.error.error.message;
            throw e;
        });
        await this.loginAsync({ type: 'password', username: postData.username, password: postData.password });
    }

    /**
     * @description Error<string> 'wrongPassword'
     */
    async changePasswordAsync(postData: { currentPassword: string, newPassword: string }) {
        await this.http.post('/api/User.changePassword', postData).toPromise().catch((e: HttpErrorResponse) => {
            if (e.status == 400) throw e.error.error.message;
            throw e;
        });
    }

    private updateUserAsync(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.userStream) {
                this.userStream.refreshAsync().then(v => resolve(v), e => reject(e));
            }
            else {
                const stream = this.httpWatcher.getStream('/api/User.getGlobalUser', {
                    $expand: this.config.currentUserExpand,
                    selectedRole: null
                }, ['Users']);
                this.userStream = {
                    ...stream,
                    data$: stream.data$.pipe(map(data => {
                        let user = data['value'][0];
                        user = this.entityService.parse(user, User);
                        return user;
                    }))
                };
                this.userStream.data$.subscribe(user => {
                    this.user$.next(user);
                    resolve();
                }, error => reject(error));
            }
        });
    }


    async resendUserConfirmationAsync(postData: { username: string }) {
        await this.http.post('/api/User.resendUserConfirmation', postData).toPromise();
    }

    /**
     * @description Error<string> 'notMatch' | 'expired' | 'overTry'
     * @returns byPassLoginToken
     */
    async confirmUserAsync(postData: { username: string, token: number }): Promise<number> {
        return (await this.http.post('/api/User.confirmUser', postData).toPromise().catch((e: HttpErrorResponse) => {
            if (e.status == 400) throw e.error.error.message;
            throw e;
        }))['value'];
    }
}
