import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputPageComponent } from './input-page/input-page.component';
import { AnalyzePageComponent } from './analyze-page/analyze-page.component';
import { RhymesMatrixComponent } from './analyze-page/rhymes-matrix/rhymes-matrix.component';

@NgModule({
  declarations: [
    AppComponent,
    InputPageComponent,
    AnalyzePageComponent,
    RhymesMatrixComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
