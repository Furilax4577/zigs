import { FormGroup } from '@angular/forms';
import { MqttService } from './../../services/mqtt.service';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-zendure-mqtt-step',
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatBadgeModule],
  templateUrl: './zendure-mqtt-step.component.html',
  styleUrl: './zendure-mqtt-step.component.scss',
})
export class ZendureMqttStepComponent {
  @Input({ required: true }) zendureMQTTForm!: FormGroup;

  constructor(private mqttService: MqttService) {}

  ngOnInit() {
    this.mqttService.connect('ws://localhost:3000');
    this.mqttService.sendMessage({
      appKey: this.zendureMQTTForm.get('appKey')?.value,
      secret: this.zendureMQTTForm.get('secret')?.value,
      mqttUrl: this.zendureMQTTForm.get('mqttUrl')?.value,
      port: this.zendureMQTTForm.get('port')?.value,
    });
  }

  ngOnDestroy() {
    this.mqttService.close();
  }
}
