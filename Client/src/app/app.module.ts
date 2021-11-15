import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { HeaderInterceptor } from './core/services/httpinterceptor.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './core/services/loading.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonsModule.forRoot(),
    HttpClientModule,
    CoreModule,
    HomeModule,
    NgxSpinnerModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
