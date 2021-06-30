import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyzePageComponent } from './analyze-page/analyze-page.component';
import { InputComponent } from './input/input.component';

const routes: Routes = [
  {
    path: '',
    component: InputComponent
  },
  {
    path: 'analyze',
    component: AnalyzePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
