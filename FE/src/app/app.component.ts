import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { StateService } from './services/state.service';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  public state$ = this.stateService.state$
  public resultsDisabled = true
  public processingDisabled = true
  constructor(private stateService: StateService,  private cdRef: ChangeDetectorRef) {}
  title = 'FE';
  @ViewChild(NgbAccordion) accordion: NgbAccordion

  ngAfterViewInit(): void {
    this.state$.subscribe(res => {
      if (res.state === "processing") {
        this.resultsDisabled = true;
        this.processingDisabled = false; }
      else this.processingDisabled = true;
      if (res.state === "result") this.resultsDisabled = false;
      console.log(res)
      this.cdRef.detectChanges()
      this.accordion.expand(res.state);})
  }
}
