import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { en_US, NgZorroAntdModule, NZ_I18N } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { AgmCoreModule } from '@agm/core';
import { BsDropdownModule } from 'ngx-bootstrap';
import { jwtProvider } from './shared/interceptors/jwt.interceptor';
import { errorProvider } from './shared/interceptors/error.interceptor';
import { mockProvider } from './shared/interceptors/mock.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { TeximateModule } from 'ngx-teximate';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { DEFAULT_TIMEOUT, timeoutProvider } from './shared/interceptors/timeout.interceptor';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { UsersRouteDataProvider } from './management/modules/users/users-route-data.provider';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
import {SimpleSmoothScrollModule} from 'ng2-simple-smooth-scroll';

// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgZorroAntdModule,
    NgProgressModule.withConfig({
      spinnerPosition: 'left',
      spinner: false,
      meteor: false,
      thick: false,
      color: 'red',
    }),
    NgProgressHttpModule,
    NgProgressRouterModule,
    ToastrModule.forRoot({
      progressBar: true,
      progressAnimation: 'decreasing',
      tapToDismiss: true,
      positionClass: 'toast-bottom-right',
      timeOut: 5000,
      enableHtml: true,
    }),
    BsDropdownModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    TeximateModule,
    GooglePlaceModule,
    SimpleSmoothScrollModule
  ],
  providers: [
    {provide: NZ_I18N, useValue: en_US},
    jwtProvider,
    errorProvider,
    mockProvider,
    timeoutProvider,
    {provide: DEFAULT_TIMEOUT, useValue: 3000},
    UsersRouteDataProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
