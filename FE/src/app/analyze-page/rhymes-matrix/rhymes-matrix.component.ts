import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { RhymeType } from 'src/app/services/state.service';
import { getColor } from '../analyze-page.component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-rhymes-matrix',
  templateUrl: './rhymes-matrix.component.html',
  styleUrls: ['./rhymes-matrix.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhymesMatrixComponent implements OnInit {
  @Input() rhymes: string[];
  @Input() rhymeTypes: RhymeType[];
  @Input() rhymeRatings: (number | '-')[];
  @Input() components: string[];
  @Input() stressMoved: boolean[];
  @Output() highlight = new EventEmitter<number[]>();
  constructor() {}

  public getColor(i: number, j: number) {
    return getColor(this.rhymeRatings, this.rhymes, this.rhymeTypes, i, j);
  }
  public getPopoverText(i: number, j: number) {
    const first = Math.min(i, j);
    const second = Math.max(i, j);
    const text =
      `Type: ${this.rhymeTypes[i]}<br/>` +
      `Rhyming phonemes 1st: ${this.components[first]}<br/>` +
      `Rhyming phonemes 2nd: ${this.components[second]}<br/>` +
      `Stress moved: ${this.stressMoved[second]} <br/>` +
      `Rhyme rating: ${this.rhymeRatings[second]}<br />`;
    return text;
  }
  ngOnInit(): void {}
}
