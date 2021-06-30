import { Component } from '@angular/core';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public state$ = this.stateService.state$
  constructor(private stateService: StateService) {}
  title = 'FE';
}
