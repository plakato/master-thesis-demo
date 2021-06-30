import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastService } from './toast.service';
export type Scheme = (string | Symbol)[];

interface AnalysisConfig {
  perfect_only?: boolean;
  // Greater than 0.
  window?: number;
  // Between 0 and 1.
  rhyme_rating_min?: number;
  // Between 0 and 1.
  zero_value?: number;
}
interface RhymesResponse {
  res: {
    ratings: RhymesResponse__rating[];
    relevant_components: RhymesResponse__component[];
    scheme: Scheme;
    song_rating: number;
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
  analysisConfig: AnalysisConfig;
}

const initialState: State = {
  state: 'input',
  analysisConfig: { window: 3, perfect_only: false, rhyme_rating_min: 0.8, zero_value: 0.001 },
  analyzedText: '',
  result: null
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

  public submitForAnalysis(analyzedText: string, config: AnalysisConfig) {
    this.updateState((currentState) => ({
      ...currentState,
      state: 'processing',
      analyzedText,
      analysisConfig: config,
      result: initialState.result
    }));
    return this.http
      .post<RhymesResponse>(`${environment.api}rhymes`, { text: analyzedText.split('\n'), ...config })
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
              rating: res.song_rating,
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
