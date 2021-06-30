import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  public fg = this.fb.group({ input: ['', Validators.required] });
  constructor(private fb: FormBuilder, private stateService: StateService, private router: Router) {}

  ngOnInit(): void {
    this.stateService.getAnalyzedText().subscribe(res => this.fg.get('input').patchValue(res))
  }
  public onSubmit() {
    if (this.fg.valid) {
      this.stateService.setAnalyzedText(this.fg.controls.input.value);
    }
  }
}
