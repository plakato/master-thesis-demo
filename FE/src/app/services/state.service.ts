import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastService } from './toast.service';
export type Scheme = (string | Symbol)[];

interface RhymesResponse {
  res: {
    ratings: RhymesResponse__rating[];
    relevant_components: RhymesResponse__component[];
    scheme: Scheme;
    rating: number;
  };
}

interface RhymesResponse__rating {
  other_candidates: RhymesResponse__rating[];
  rating: number | '-';
  relevant_components: string[];
  relevant_components_rhyme_fellow: string[];
  rhyme_fellow: number;
}

interface RhymesResponse__component {}
export interface State__result {
  scheme: Scheme;
  rating: number;
  lines: string[];
  rhymeTypes: ('P' | 'N' | 'X')[];
}
export interface State {
  state: 'input' | 'processing' | 'result';
  analyzedText: string;
  result: State__result;
}

const initialState: State = {
  // state: "input",
  // analyzedText: "",
  // scheme: null
  state: 'result',
  analyzedText:
    'Roses are red\nviolets are blue\nare you a fed\nor are you true?\nGive me a favor\ndo you have a fever\nThat is it\nBe here on time',
  result: {
    scheme: ['a', 'b', 'a', 'b', 'c', 'c', Symbol(), Symbol()],
    lines: [
      'Roses are red',
      'violets are blue',
      'are you a fed',
      'or are you true?',
      'Give me a favor',
      'do you have a fever',
      'That is it',
      'Be here on time'
    ],
    rating: 0.2,
    rhymeTypes: ['P', 'P', 'P', 'P', 'N', 'N', 'X', 'X']
  }
};

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private state = new BehaviorSubject<State>(initialState);
  public state$ = this.state.asObservable();
  constructor(private http: HttpClient, private toast: ToastService) {}

  public getAnalyzedText(): Observable<string> {
    return this.state$.pipe(map((x) => x.analyzedText));
  }

  public getScheme(): Observable<Scheme> {
    return this.state$.pipe(
      filter((x) => x.state === 'result'),
      map((x) => x.result.scheme)
    );
  }

  public getResult(): Observable<State__result> {
    return this.state$.pipe(
      filter((x) => x.state === 'result'),
      map((x) => x.result)
    );
  }

  public setAnalyzedText(analyzedText: string) {
    this.updateState((currentState) => ({
      ...currentState,
      state: 'processing',
      analyzedText,
      result: initialState.result
    }));
    return this.http
      .post<RhymesResponse>(`${environment.api}rhymes`, { text: analyzedText.split('\n') })
      .pipe(
        map((x) => x.res),
        map((x) => ({ ...x, scheme: x.scheme.map((elem) => (elem === '-' ? Symbol() : elem)) }))
      )
      .subscribe(
        (res) =>
          this.updateState((currentState) => ({
            ...currentState,
            state: 'result',
            result: {
              rating: res.rating,
              scheme: res.scheme,
              lines: analyzedText.split('\n'),
              rhymeTypes: this.getRhymeTypes(res)
            }
          })),
        (err) => {
          this.toast.show('Analysis was unsuccessful.', 5000),
            this.updateState((currentState) => ({ ...currentState, state: 'input' }));
        }
      );
  }
  getRhymeTypes(res: { ratings: RhymesResponse__rating[]; scheme: Scheme }): ('P' | 'N' | 'X')[] {
    const ret = new Array(res.scheme.length).fill('X');
    res.ratings.forEach((val, idx) => {
      if (val.rating != 0) ret[idx] = 'N';
    });
    res.ratings.forEach((val, idx) => {
      if (val.rating === 1) {
        ret[idx] = 'P';
        ret[idx + val.rhyme_fellow] = 'P';
      }
    });
    return ret;
  }

  private updateState(f: (currentState: State) => State) {
    const currentState = this.state.value;
    const newState = f(currentState);
    this.state.next(newState);
  }
}
