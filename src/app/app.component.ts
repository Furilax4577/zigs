import { Component, isDevMode, ViewChild } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ZendureApiStepComponent } from './components/zendure-api-step/zendure-api-step.component';
import { HassConfigStepComponent } from './components/hass-config-step/hass-config-step.component';
import { ZendureMqttStepComponent } from './components/zendure-mqtt-step/zendure-mqtt-step.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ZendureApiResponse, ZendureMockedData } from './interfaces';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    MatStepperModule,
    ZendureApiStepComponent,
    HassConfigStepComponent,
    ZendureMqttStepComponent,
    JsonPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild(MatStepper) stepper!: MatStepper;

  zendureApiForm = new FormGroup({
    account: new FormControl('', [Validators.required]),
    snNumber: new FormControl('', [Validators.required]),
  });

  zendureMQTTForm = new FormGroup({
    appKey: new FormControl('', [Validators.required]),
    secret: new FormControl('', [Validators.required]),
  });

  nextStep(event: ZendureApiResponse) {
    console.log('nextStep', event);
    this.zendureMQTTForm.patchValue({
      appKey: event.data.appKey,
      secret: event.data.secret,
    });
    this.stepper.next();
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
