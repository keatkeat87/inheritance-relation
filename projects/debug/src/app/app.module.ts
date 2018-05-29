import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// import {
//   StoogesAppModule, TITLE_META_DESCRIPTION_CONFIG, UPLOADED_PATH_CONFIG, API_SERVER_CONFIG, APIServerConfig, UploadedPathConfig, TitleMetaDescriptionConfig
// } from '../../../stooges/src/public_api';
import {
  StoogesAppModule, TITLE_META_DESCRIPTION_CONFIG, UPLOADED_PATH_CONFIG, API_SERVER_CONFIG, APIServerConfig, UploadedPathConfig, TitleMetaDescriptionConfig
} from 'stooges';


import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

let dada = 'ttc';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoogesAppModule
  ],
  providers: [
    { provide: TITLE_META_DESCRIPTION_CONFIG, useValue: new TitleMetaDescriptionConfig({ titleSuffix: 'Depicco' }) },
    { provide: UPLOADED_PATH_CONFIG, useValue: new UploadedPathConfig({ uploadedFilesPath: environment.uploadedFilesPath }) },
    { provide: API_SERVER_CONFIG, useValue: new APIServerConfig({ path: environment.APIServer }) },

    // { provide: TITLE_META_DESCRIPTION_CONFIG, useValue: { titleSuffix: 'Depicco' } },
    // { provide: UPLOADED_PATH_CONFIG, useValue: { uploadedFilesPath: environment.uploadedFilesPath } },
    // { provide: API_SERVER_CONFIG, useValue: { path: environment.APIServer }},


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
