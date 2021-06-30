import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastService } from './toast.service';

interface RhymesResponse{
  res: {
    ratings: RhymesResponse__rating[],
    relevant_components: RhymesResponse__component[],
    scheme: string[]
  }
}

interface RhymesResponse__rating{

}

interface RhymesResponse__component{

}

export interface State{
  state: "input" | "processing" | "result";
  analyzedText: string;
  scheme: string[];
}

const initialState: State = {
  state: "input",
  analyzedText: "",
  scheme: null
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private state = new BehaviorSubject<State>(initialState)
  public state$ = this.state.asObservable()
  constructor(private http: HttpClient,
              private toast: ToastService) { }

  public getAnalyzedText(): Observable<string>{
    return this.state$.pipe(map(x => x.analyzedText))
  }

  public setAnalyzedText(analyzedText: string) {
    this.updateState((currentState) => ({...currentState, state: "processing", analyzedText, scheme: initialState.scheme}))
    return this.http.post<RhymesResponse>(`${environment.api}rhymes`, {text: analyzedText.split('\n')})
                    .pipe(map(x => x.res))
                    .subscribe(res => this.updateState((currentState) => ({...currentState, state: 'result', scheme: res.scheme})),
                               err => {this.toast.show('Analysis was unsuccessful.', 5000),
                                      this.updateState((currentState) => ({...currentState, state: 'input'}))})
  }

  private updateState(f: (currentState: State) => State){
    const currentState = this.state.value
    const newState = f(currentState) 
    this.state.next(newState)

  }
}
