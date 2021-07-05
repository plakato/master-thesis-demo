import { Component, OnInit } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { StateService, Scheme, State__result, RhymeType } from '../services/state.service';

export function getColor(
  rhymeRatings: (number | '-')[],
  scheme: string[],
  rhymeTypes: RhymeType[],
  i: number,
  j: number
): string {
  let color: [number, number, number];
  const ratings = rhymeRatings.filter((x) => x !== '-') as number[];
  const min = ratings.reduce((it, cur) => Math.min(it, cur), ratings[0]) || 0;
  const max = ratings.reduce((it, cur) => Math.max(it, cur), ratings[0]) || 1;
  if (scheme[i] === scheme[j]) {
    const rhymeType = rhymeTypes[i];
    let rating = rhymeRatings[Math.max(i, j)] as number;

    rating = (rating - min) / (max - min);
    const scale = rating === 0 ? 0 : rating * 0.9 + 0.05;
    switch (rhymeType) {
      case RhymeType.PM:
        color = [0xf9, 0x84, 0x4a];
        break;
      case RhymeType.PF:
        color = [0xf8, 0x96, 0x1e];
        break;
      case RhymeType.PD:
        color = [0xf9, 0xc7, 0x4f];
        break;
      case RhymeType.F:
        color = [0x43, 0xaa, 0x8b];
        break;
      case RhymeType.IM:
        color = [0x27, 0x7d, 0xa1];
        break;
      default:
        color = [0, 0, 0];
    }
    color = color.map((c) => (c = 255 - c)).map((c) => 255 - scale * c) as [number, number, number];
  } else {
    return null;
  }
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

@Component({
  selector: 'app-analyze-page',
  templateUrl: './analyze-page.component.html',
  styleUrls: ['./analyze-page.component.scss']
})
export class AnalyzePageComponent {
  public analyze: State__result;
  public rhymesHighlight: number[] = [];
  constructor(private stateService: StateService) {}
  public RhymeType = RhymeType;
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

  public getColor(i: number) {
    const j = this.analyze.scheme.lastIndexOf(this.analyze.scheme[i]);
    return getColor(this.analyze.rhymeRatings, this.analyze.scheme as string[], this.analyze.rhymeTypes, i, j);
  }

  public getPercentage(rt: RhymeType): number {
    const total = this.analyze.rhymeTypes.filter((x) => x != RhymeType.X).length;
    const count = this.analyze.rhymeTypes.filter((x) => x === rt).length;
    return (100 * count) / total;
  }
}
