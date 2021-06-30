import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnalyzePageComponent } from './analyze-page/analyze-page.component';
import { RhymesMatrixComponent } from './analyze-page/rhymes-matrix/rhymes-matrix.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputComponent } from './input/input.component';
import { ToastsComponent } from './toasts/toasts.component';


@NgModule({
  declarations: [
    AppComponent,
    AnalyzePageComponent,
    RhymesMatrixComponent,
    ToastsComponent,
    InputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
