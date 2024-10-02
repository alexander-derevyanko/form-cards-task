import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {CheckUserResponseData, SubmitFormResponseData} from "../../shared/interface/responses";

@Injectable()
export class FormCardsApiService {
  private readonly http: HttpClient = inject(HttpClient);

  public checkUsername(username: string): Observable<CheckUserResponseData> {
    return this.http.post<CheckUserResponseData>('/api/checkUsername', { username });
  }

  public submitForm(payload: any): Observable<SubmitFormResponseData> {
    return this.http.post<SubmitFormResponseData>('/api/submitForm', payload)
  }
}
