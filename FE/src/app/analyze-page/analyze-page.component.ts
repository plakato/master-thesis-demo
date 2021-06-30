import { Component, OnInit } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { StateService, Scheme, State__result } from '../services/state.service';

@Component({
  selector: 'app-analyze-page',
  templateUrl: './analyze-page.component.html',
  styleUrls: ['./analyze-page.component.scss']
})
export class AnalyzePageComponent {
  public analyze: State__result;
  public rhymesHighlight: number[] = [];
  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    this.stateService.getResult().subscribe((res) => (this.analyze = res));
  }

  public onMouseEnter(i: number) {
    const letter = this.analyze.scheme[i];
    this.rhymesHighlight = this.analyze.scheme.reduce((arr, e, i) => (e == letter && arr.push(i), arr), []);
  }

  public onMouseLeave() {
    this.rhymesHighlight = [];
  }

  public convertSymbolToDash(s: string | Symbol) {
    if (typeof s === 'symbol') {
      return '-';
    } else {
      return s;
    }
  }

  public onHighlight(toHighlight: number[]) {
    this.rhymesHighlight = toHighlight;
  }

  public isHighlighted(i: number): boolean {
    return this.rhymesHighlight.includes(i);
  }
}
