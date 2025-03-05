import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  ZendureApiResponse,
  ZendureMockedData,
  ZendurePostData,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ZendureApiService {
  constructor(private http: HttpClient) {}

  getMqttCredentials(data: ZendurePostData): Observable<ZendureApiResponse> {
    if (isDevMode()) {
      return this.http.get<ZendureMockedData>('config.json').pipe(
        map((config) => {
          return {
            code: 200,
            success: true,
            data: {
              appKey: config.mqtt.appKey,
              secret: config.mqtt.secret,
              mqttUrl: config.mqtt.mqttUrl ?? 'mqtt-eu.zen-iot.com',
              port: config.mqtt.port ?? 1883,
            },
            msg: 'Successful operation (Mocked)',
          } as ZendureApiResponse;
        })
      );
    } else {
      return this.http.post<ZendureApiResponse>(
        'https://app.zendure.tech/eu/developer/api/apply',
        {
          snNumber: data.snNumber,
          account: data.account,
        }
      );
    }
  }
}
