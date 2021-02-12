import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface RhymesResponse{
  res: string[]
}

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {
  constructor(private http: HttpClient) {
    
  }

  public getRhymes(text: string[]): Observable<string[]> {
    return this.http.post<RhymesResponse>(`${environment.api}rhymes`, {text}).pipe(map(x => x.res))
    const possibilities = ['a', 'b', 'c', 'd', 'xx'];
    const mock = [];
    for (let i = 0; i < text.length; i++) {
      mock.push(possibilities[Math.floor(Math.random() * possibilities.length)]);
    }
    return of(mock).pipe(delay(2000));
  }
}
