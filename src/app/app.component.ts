import { Component, isDevMode } from '@angular/core';
import { ZendureApiStepComponent } from './components/zendure-api-step/zendure-api-step.component';
import { HassConfigStepComponent } from './components/hass-config-step/hass-config-step.component';
import { ZendureMqttStepComponent } from './components/zendure-mqtt-step/zendure-mqtt-step.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  ZendureApiResponse,
  ZendureDevices,
  ZendureDeviceSensor,
  ZendureMockedData,
} from './interfaces';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    ZendureApiStepComponent,
    HassConfigStepComponent,
    ZendureMqttStepComponent,
    MainMenuComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  mqttDisplay = false;
  devices: ZendureDevices = {};
  sensors: ZendureDeviceSensor[] = [];

  zendureApiForm = new FormGroup({
    account: new FormControl('', [Validators.required]),
    snNumber: new FormControl('', [Validators.required]),
  });

  zendureMQTTForm = new FormGroup({
    appKey: new FormControl('', [Validators.required]),
    secret: new FormControl('', [Validators.required]),
    mqttUrl: new FormControl('mqtt-eu.zen-iot.com', [Validators.required]),
    port: new FormControl<number>(1883, [Validators.required]),
  });

  nextStep(event: ZendureApiResponse) {
    this.zendureMQTTForm.patchValue({
      appKey: event.data.appKey,
      secret: event.data.secret,
      mqttUrl: event.data.mqttUrl,
      port: event.data.port,
    });
    this.mqttDisplay = true;
  }

  constructor(private http: HttpClient) {
    if (isDevMode()) {
      this.http.get<ZendureMockedData>('config.json').subscribe((config) => {
        this.zendureApiForm.patchValue({
          account: config.form.account,
          snNumber: config.form.snNumber,
        });
      });
    }
  }
}
