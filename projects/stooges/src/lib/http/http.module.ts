import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptor } from './http-interceptor.service';

@NgModule({
  imports: [HttpClientModule],
  exports: [],
  declarations: [],
  providers: [
    HttpInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: HttpInterceptor,
      multi: true
    }
  ]
})
export class HttpModule { }
