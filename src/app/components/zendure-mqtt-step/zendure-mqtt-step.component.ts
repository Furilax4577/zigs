import { FormGroup } from '@angular/forms';
import { MqttService } from './../../services/mqtt.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-zendure-mqtt-step',
  imports: [],
  templateUrl: './zendure-mqtt-step.component.html',
  styleUrl: './zendure-mqtt-step.component.scss',
})
export class ZendureMqttStepComponent {
  @Input({ required: true }) zendureMQTTForm!: FormGroup;

  constructor(private mqttService: MqttService) {}

  ngOnInit() {
    console.log(this.constructor.name, 'ngOnInit');
    this.mqttService.connect('ws://localhost:3000');
    this.mqttService.sendMessage({
      appKey: 'MH7dA2cl',
      secret: 'E0939CD239EC47B999327F172F4AD507',
    });
  }

  ngOnDestroy() {
    console.log(this.constructor.name, 'ngOnDestroy');
    this.mqttService.close();
  }
}
