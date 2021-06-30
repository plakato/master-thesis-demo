import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  public fg = this.fb.group({
    input: ['', Validators.required],
    config: this.fb.group({
      window: [3, Validators.min(1)],
      perfect_only: [false],
      rhyme_rating_min: [0.8, [Validators.min(0), Validators.max(1)]],
      zero_value: [0.001, [Validators.min(0), Validators.max(1)]]
    })
  });
  constructor(private fb: FormBuilder, private stateService: StateService, private router: Router) {}

  ngOnInit(): void {
    this.stateService.state$.subscribe((res) => {
      this.fg.get('input').patchValue(res.analyzedText);
      this.fg.get('config').patchValue(res.analysisConfig);
    });
  }
  public onSubmit() {
    if (this.fg.valid) {
      this.stateService.submitForAnalysis(this.fg.controls.input.value, this.fg.controls.config.value);
    }
  }
}
