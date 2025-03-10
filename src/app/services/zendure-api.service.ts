import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { ZendureApiResponse, ZendurePostData } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ZendureApiService {
  constructor(private http: HttpClient) {}

  getMqttCredentials(data: ZendurePostData): Observable<ZendureApiResponse> {
    return this.http.post<ZendureApiResponse>(
      'http://localhost:3000/zendure/apply',
      {
        snNumber: data.snNumber,
        account: data.account,
      }
    );
  }
}
