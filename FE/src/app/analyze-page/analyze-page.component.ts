import { Component, OnInit } from '@angular/core';
import { AnalyzeService } from '../analyze.service';
import { InputStoreService } from '../input-page/input-store.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';

interface AnalyzeResult {
  lines: string[];
  rhymes: string[];
}

@Component({
  templateUrl: './analyze-page.component.html',
  styleUrls: ['./analyze-page.component.scss']
})
export class AnalyzePageComponent implements OnInit {
  public analyze$: Observable<AnalyzeResult>;
  public rhymesHighlight: number[] = [];
  constructor(private inputStore: InputStoreService, private analyzeService: AnalyzeService) {}

  ngOnInit(): void {
    const text$ = this.inputStore.text$.pipe();
    const rhymes$ = this.inputStore.text$.pipe(switchMap((lines) => this.analyzeService.getRhymes(lines)));
    this.analyze$ = combineLatest([text$, rhymes$]).pipe(map(([text, rhymes]) => ({ lines: text, rhymes })));
  }

  public onHighlight(toHighlight: number[]) {
    this.rhymesHighlight = toHighlight;
  }

  public isHighlighted(i: number): boolean {
    return this.rhymesHighlight.includes(i);
  }
}
