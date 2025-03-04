import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private socket$: WebSocketSubject<any> | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public connect(url: string): void {
    if (
      isPlatformBrowser(this.platformId) &&
      (!this.socket$ || this.socket$.closed)
    ) {
      this.socket$ = webSocket(url);

      // Gérer les messages reçus
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

  private handleMessage(message: any): void {
    console.log('Message reçu:', message);
  }

  private handleError(error: any): void {
    console.error('Erreur WebSocket:', error);
  }
}
