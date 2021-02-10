import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyzePageComponent } from './analyze-page/analyze-page.component';
import { InputPageComponent } from './input-page/input-page.component';

const routes: Routes = [
  {
    path: '',
    component: InputPageComponent
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
