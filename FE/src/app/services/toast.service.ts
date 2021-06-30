import { Injectable } from '@angular/core';

export interface Toast {
  body: string;
  delay: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}

  public toasts: Toast[] = [];

  show(body: string, delay: number = 5000) {
    this.toasts.push({ body, delay });
    console.log(this.toasts);
  }

  remove(toast: Toast) {
    console.log('tremove');
    this.toasts = this.toasts.filter((t) => t != toast);
  }
}
