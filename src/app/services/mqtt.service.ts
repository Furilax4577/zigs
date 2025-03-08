import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { isPlatformBrowser } from '@angular/common';
import { MqttMessage } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  socket$: WebSocketSubject<MqttMessage> | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public connect(url: string): void {
    if (
      isPlatformBrowser(this.platformId) &&
      (!this.socket$ || this.socket$.closed)
    ) {
      this.socket$ = webSocket(url);
      this.socket$.subscribe({
        next: (message) => this.handleMessage(message),
        error: (err) => this.handleError(err),
        complete: () => console.log('WebSocket connection closed'),
      });
    }
  }

  public sendMessage(msg: any): void {
    if (this.socket$) {
      this.socket$.next(msg);
    }
  }

  public close(): void {
    this.socket$?.complete();
  }

  private handleMessage(mqttMessage: MqttMessage): void {
    // console.log('Message reçu:', mqttMessage.message);
  }

  private handleError(error: any): void {
    console.error('Erreur WebSocket:', error);
  }
}
