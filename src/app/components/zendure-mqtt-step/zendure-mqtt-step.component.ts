import { MqttService } from './../../services/mqtt.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-zendure-mqtt-step',
  imports: [],
  templateUrl: './zendure-mqtt-step.component.html',
  styleUrl: './zendure-mqtt-step.component.scss',
})
export class ZendureMqttStepComponent {
  messages: any[] = [];

  constructor(private mqttService: MqttService) {}

  ngOnInit() {
    this.mqttService.connect('ws://localhost:3000');
  }

  ngOnDestroy() {
    this.mqttService.close();
  }
}
