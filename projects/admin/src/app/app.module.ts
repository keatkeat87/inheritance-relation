import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  StoogesAppModule,
  TITLE_META_DESCRIPTION_CONFIG, TitleMetaDescriptionConfig,
  UploadedPathConfig, UPLOADED_PATH_CONFIG,
  APIServerConfig, API_SERVER_CONFIG,
  MatErrorStateMatcher, MAT_CP_TABLE_CONFIG, MatCPTableConfig, ENTITY_CONFIG, EntityConfig
} from '../../../stooges/src/public_api';

import { environment } from '../environments/environment';
import {
  ErrorStateMatcher,
  MatDialogModule
} from '@angular/material';
import {
  Admin, Carousel, Event, NonVirtualRunEvent, VirtualRunEvent, FAQ, Post, Product, Testimonial
} from './entities/Resource';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    StoogesAppModule,
    AppRoutingModule,
    MatDialogModule // bug: v6.1.0 暂时有关 overlay 的都要在 App root import 
  ],
  providers: [
    { provide: TITLE_META_DESCRIPTION_CONFIG, useValue: new TitleMetaDescriptionConfig({ titleSuffix: 'Depicco' }) },
    { provide: UPLOADED_PATH_CONFIG, useValue: new UploadedPathConfig({ uploadedFilesPath: environment.uploadedFilesPath }) },
    { provide: API_SERVER_CONFIG, useValue: new APIServerConfig({ path: environment.APIServer }) },
    { provide: ErrorStateMatcher, useClass: MatErrorStateMatcher }, // material error
    { provide: MAT_CP_TABLE_CONFIG, useValue: new MatCPTableConfig({ defaultLanguage: 'en', supportedLanguages: ['en'] }) },
    {
      provide: ENTITY_CONFIG,
      useValue: new EntityConfig({
        sqlRoles: [{ Id: 1, Name: 'Admin' }],
        entities: {
          Event: Event,
          Admin, Carousel, NonVirtualRunEvent, VirtualRunEvent, FAQ, Post, Product, Testimonial
        }
      })
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

