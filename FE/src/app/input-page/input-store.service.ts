import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputStoreService {
  constructor() {}

  // private text = new ReplaySubject<string[]>(1);
  private text = new BehaviorSubject<string[]>([
    'bebe',
    'cece',
    'dede',
    'eeee',
    'bebe',
    'cece',
    'dede',
    'eeee',
    'bebe',
    'cece',
    'dede',
    'eeee'
  ]);

  public submitText(text: string): void {
    this.text.next(text.split('\n'));
  }

  public get text$(): Observable<string[]> {
    return this.text.asObservable();
  }
}
