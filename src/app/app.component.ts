import { Component, isDevMode, ViewChild } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ZendureApiStepComponent } from './components/zendure-api-step/zendure-api-step.component';
import { HassConfigStepComponent } from './components/hass-config-step/hass-config-step.component';
import { ZendureMqttStepComponent } from './components/zendure-mqtt-step/zendure-mqtt-step.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ZendureMockedData } from './interfaces';

@Component({
  selector: 'app-root',
  imports: [
    MatStepperModule,
    ZendureApiStepComponent,
    HassConfigStepComponent,
    ZendureMqttStepComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild(MatStepper) stepper!: MatStepper;

  zendureForm = new FormGroup({
    account: new FormControl('', [Validators.required]),
    snNumber: new FormControl('', [Validators.required]),
  });

  nextStep() {
    this.stepper.next();
  }

  constructor(private http: HttpClient) {
    if (isDevMode()) {
      this.http.get<ZendureMockedData>('config.json').subscribe((config) => {
        this.zendureForm.patchValue({
          account: config.form.account,
          snNumber: config.form.snNumber,
        });
      });
    }
  }
}
