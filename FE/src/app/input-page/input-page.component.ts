import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputStoreService } from './input-store.service';

@Component({
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.scss']
})
export class InputPageComponent implements OnInit {
  public fg = this.fb.group({ input: ['', Validators.required] });
  constructor(private fb: FormBuilder, private inputStore: InputStoreService, private router: Router) {}

  ngOnInit(): void {}
  public onSubmit() {
    if (this.fg.valid) {
      this.inputStore.submitText(this.fg.controls.input.value);
      this.router.navigate(['analyze']);
    }
  }
}
