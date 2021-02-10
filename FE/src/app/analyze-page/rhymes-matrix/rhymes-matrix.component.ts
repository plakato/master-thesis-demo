import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rhymes-matrix',
  templateUrl: './rhymes-matrix.component.html',
  styleUrls: ['./rhymes-matrix.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RhymesMatrixComponent implements OnInit {
  @Input() rhymes: string[];
  @Output() highlight = new EventEmitter<number[]>();
  constructor() {}

  ngOnInit(): void {}
}
