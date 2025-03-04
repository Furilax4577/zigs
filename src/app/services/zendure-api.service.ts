import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ZendureApiResponse, ZendurePostData } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ZendureApiService {
  constructor(private http: HttpClient) {}

  getMqttCredentials(data: ZendurePostData): Observable<ZendureApiResponse> {
    return isDevMode()
      ? of({
          code: 200,
          success: true,
          data: {
            appKey: '',
            secret: '',
            mqttUrl: 'mqtt-eu.zen-iot.com',
            port: 1883,
          },
          msg: 'Successful operation',
        }).pipe(delay(3000))
      : this.http.post<ZendureApiResponse>(
          'https://app.zendure.tech/eu/developer/api/apply',
          {
            snNumber: data.snNumber,
            account: data.account,
          }
        );
  }
}
