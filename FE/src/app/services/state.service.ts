import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastService } from './toast.service';
export type Scheme = (string | Symbol)[];
export enum RhymeType {
  PM = 'perfect masculine',
  PF = 'perfect feminine',
  PD = 'perfect dactylic',
  IM = 'imperfect',
  F = 'forced',
  X = 'none'
}
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
  res: RhymeResponse_res;
}

interface RhymeResponse_res {
  ratings: RhymesResponse__rating[];
  relevant_components: string[][];
  scheme: Scheme;
  song_rating: number;
}

interface RhymesResponse__rating {
  other_candidates: RhymesResponse__rating[];
  rating: number | '-';
  relevant_components: string[];
  relevant_components_rhyme_fellow: string[];
  rhyme_fellow: number;
  stress_moved: boolean;
}

export interface State__result {
  scheme: Scheme;
  rating: number;
  lines: string[];
  rhymeTypes: RhymeType[];
  rhymeRatings: (number | '-')[];
  relevantComponents: string[];
  stressMoved: boolean[];
}
export interface State {
  state: 'input' | 'processing' | 'result';
  analyzedText: string;
  result: State__result;
  analysisConfig: AnalysisConfig;
}

const initialState: State = {
  state: 'input',
  analysisConfig: { window: 5, perfect_only: false, rhyme_rating_min: 0.8, zero_value: 0.001 },
  analyzedText: '',
  result: null
  // state: 'result',
  // analysisConfig: {
  //   window: 3,
  //   perfect_only: false,
  //   rhyme_rating_min: 0.8,
  //   zero_value: 0.001
  // },
  // analyzedText:
  //   'dvlkagvprdf \nvadfm kl\nvdfonvlm\nadovnlk\nasdcolnk\ndvlkagvprdf \nvadfm kl\nvdfonvlm\nadovnlk\nasdcolnk\ndvlkagvprdf \nvadfm kl\nvdfonvlm\nadovnlk\nasdcolnkdvlkagvprdf \nvadfm kl\nvdfonvlm\nadovnlk\nasdcolnk',
  // result: {
  //   rating: 0,
  //   scheme: ['a', 'a', 'b', 'b', 'c', 'c', 'd', 'd', 'e', 'e', 'f', 'f', 'g', 'g', 'h', 'h', '-', 'i', 'i'],
  //   lines: [
  //     'dvlkagvprdf ',
  //     'vadfm kl',
  //     'vdfonvlm',
  //     'adovnlk',
  //     'asdcolnk',
  //     'dvlkagvprdf ',
  //     'vadfm kl',
  //     'vdfonvlm',
  //     'adovnlk',
  //     'asdcolnk',
  //     'dvlkagvprdf ',
  //     'vadfm kl',
  //     'vdfonvlm',
  //     'adovnlk',
  //     'asdcolnkdvlkagvprdf ',
  //     'vadfm kl',
  //     'vdfonvlm',
  //     'adovnlk',
  //     'asdcolnk'
  //   ],
  //   rhymeTypes: [
  //     RhymeType.PM,
  //     RhymeType.PM,
  //     RhymeType.PF,
  //     RhymeType.PF,
  //     RhymeType.PD,
  //     RhymeType.PD,
  //     RhymeType.IM,
  //     RhymeType.IM,
  //     RhymeType.IM,
  //     RhymeType.IM,
  //     RhymeType.IM,
  //     RhymeType.IM,
  //     RhymeType.F,
  //     RhymeType.F,
  //     RhymeType.F,
  //     RhymeType.F,
  //     RhymeType.X,
  //     RhymeType.F,
  //     RhymeType.F
  //   ],
  //   relevantComponents: [
  //     'AA  F ER D',
  //     'EH L',
  //     'AH  F L AH N',
  //     'AA  V AH N K',
  //     'AO L K',
  //     'AA  F ER D',
  //     'EH L',
  //     'AH  F L AH N',
  //     'AA  V AH N K',
  //     'AO L K',
  //     'AA  F ER D',
  //     'EH L',
  //     'AH  F L AH N',
  //     'AA  V AH N K',
  //     'AO L B R AH NG T F',
  //     'EH L',
  //     'AH  F L AH N',
  //     'AA  V AH N K',
  //     'AO L K'
  //   ],
  //   rhymeRatings: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, '-', 0.9, '-', 0.85, '-', 0.8, '-', 0.95, '-', 0.85, 0, '-', 0.8],
  //   stressMoved: [
  //     false,
  //     false,
  //     false,
  //     false,
  //     false,
  //     false,
  //     true,
  //     true,
  //     false,
  //     false,
  //     false,
  //     false,
  //     false,
  //     false,
  //     false,
  //     false,
  //     false,
  //     false
  //   ]
  // }
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
              rhymeTypes: this.getRhymeTypes(res),
              relevantComponents: res.relevant_components.map((x) => x.join(' ')),
              rhymeRatings: res.ratings.map((x) => x.rating),
              stressMoved: res.ratings.map((x) => x.stress_moved)
            }
          })),
        (err) => {
          this.toast.show('Analysis was unsuccessful.', 5000),
            this.updateState((currentState) => ({ ...currentState, state: 'input' }));
        }
      );
  }
  getRhymeTypes(res: RhymeResponse_res): RhymeType[] {
    const types: RhymeType[] = new Array(res.scheme.length).fill(RhymeType.X);
    res.ratings.forEach((val, i) => {
      if (val.rating === 1) {
        if (res.relevant_components[i].length === 2) {
          types[i] = RhymeType.PM;
          types[i + val.rhyme_fellow] = RhymeType.PM;
        } else if (res.relevant_components[i].length === 5) {
          types[i] = RhymeType.PF;
          types[i + val.rhyme_fellow] = RhymeType.PF;
        } else if (res.relevant_components[i].length === 8) {
          types[i] = RhymeType.PD;
          types[i + val.rhyme_fellow] = RhymeType.PD;
        }
      } else if (val.rating !== 0) {
        const rel_comp_fel = res.relevant_components[i + val.rhyme_fellow];
        if (rel_comp_fel.length === 0) {
          types[i] = RhymeType.X;
        } else if (
          rel_comp_fel.length === res.relevant_components[i].length &&
          res.relevant_components[i].every((v, j) => rel_comp_fel[j] === v)
        ) {
          types[i] = RhymeType.IM;
          types[i + val.rhyme_fellow] = RhymeType.IM;
        } else {
          types[i] = RhymeType.F;
          types[i + val.rhyme_fellow] = RhymeType.F;
        }
      }
    });
    return types;
  }

  private updateState(f: (currentState: State) => State) {
    const currentState = this.state.value;
    const newState = f(currentState);
    this.state.next(newState);
  }
}
