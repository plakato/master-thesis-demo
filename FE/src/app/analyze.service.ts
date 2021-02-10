import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {
  constructor() {}

  public getRhymes(text: string[]): Observable<string[]> {
    const possibilities = ['a', 'b', 'c', 'd', 'xx'];
    const mock = [];
    for (let i = 0; i < text.length; i++) {
      mock.push(possibilities[Math.floor(Math.random() * possibilities.length)]);
    }
    return of(mock).pipe(delay(2000));
  }
}
