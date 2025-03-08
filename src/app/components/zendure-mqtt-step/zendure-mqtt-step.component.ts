import {
  ZendureDevice,
  ZendureDeviceSensor,
  ZendureDeviceSwitch,
  ZendureMessageDevicePackData,
  ZendureMessageState,
} from './../../interfaces';
import { FormGroup } from '@angular/forms';
import { MqttService } from './../../services/mqtt.service';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-zendure-mqtt-step',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    CommonModule,
    KeyValuePipe,
  ],
  templateUrl: './zendure-mqtt-step.component.html',
  styleUrl: './zendure-mqtt-step.component.scss',
})
export class ZendureMqttStepComponent {
  @Input({ required: true }) zendureMQTTForm!: FormGroup;

  devices: { [key: string]: ZendureDevice } = {};
  states: { [key: string]: ZendureMessageState } = {};
  messageCount = 0;

  constructor(private mqttService: MqttService) {}

  ngOnInit() {
    this.mqttService.connect('ws://localhost:3000');

    this.mqttService.sendMessage({
      appKey: this.zendureMQTTForm.get('appKey')?.value,
      secret: this.zendureMQTTForm.get('secret')?.value,
      mqttUrl: this.zendureMQTTForm.get('mqttUrl')?.value,
      port: this.zendureMQTTForm.get('port')?.value,
    });

    this.mqttService.socket$?.subscribe((data) => {
      this.messageCount++;
      const type = data.topic.split('/')[1];
      switch (type) {
        case 'switch':
          const deviceSwitch = data.message as ZendureDeviceSwitch;
          // not used yet
          break;
        case 'sensor':
          const deviceSensor = data.message as ZendureDeviceSensor;
          const deviceUUID = deviceSensor.state_topic.split('/')[1];
          if (!this.devices[deviceUUID]) {
            this.devices[deviceUUID] = {
              uuid: deviceUUID,
              sn: '',
              sensors: { [deviceSensor.unique_id]: deviceSensor },
              switches: {},
            };
          } else {
            if (!this.devices[deviceUUID].sensors[deviceSensor.unique_id]) {
              this.devices[deviceUUID].sensors[deviceSensor.unique_id] =
                deviceSensor;
            }
          }
          break;
        default:
          const deviceData = data.message as ZendureMessageState;
          const uuid = type; // dans le cas de default, le type est l'UUID du device
          if (!this.devices[uuid]) {
            this.devices[uuid] = {
              uuid: uuid,
              sn: '',
              sensors: {},
              switches: {},
            };
          }
          if (deviceData.sn) {
            this.devices[uuid].sn = deviceData.sn;
          }
          if (!this.states[uuid]) {
            this.states[uuid] = deviceData;
          } else {
            this.states[uuid] = {
              ...this.states[uuid],
              ...deviceData,
            };
          }
          break;
      }
    });
  }

  getSensorState(deviceUUID: string, sensorName: string, unit: string) {
    if (!this.states[deviceUUID]) {
      return '';
    }
    return (
      this.states[deviceUUID][sensorName] ??
      this.getSensorStateDefaultValue(unit)
    );
  }

  getSensorStateDefaultValue(unit: string) {
    switch (unit) {
      case 'W':
        return 0;
      case '%':
        return 0;
      default:
        return '';
    }
  }

  ngOnDestroy() {
    this.mqttService.close();
  }
}
