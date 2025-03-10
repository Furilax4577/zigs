import { map } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  ZendureDevice,
  ZendureDeviceSensor,
  ZendureDeviceSwitch,
  ZendureMessageState,
} from './../../interfaces';
import { FormGroup } from '@angular/forms';
import { MqttService } from './../../services/mqtt.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-zendure-mqtt-step',
  imports: [CommonModule, KeyValuePipe, FontAwesomeModule],
  templateUrl: './zendure-mqtt-step.component.html',
  styleUrl: './zendure-mqtt-step.component.scss',
})
export class ZendureMqttStepComponent {
  @Input({ required: true }) zendureMQTTForm!: FormGroup;
  @Output() energySensors = new EventEmitter<ZendureDeviceSensor[]>();

  infoIcon = faInfoCircle;
  messageCount: number = 0;

  inverterNameModalOpened: boolean = false;
  batteriesModalOpened: boolean = false;

  devices: { [key: string]: ZendureDevice } = {};
  states: { [key: string]: ZendureMessageState } = {};

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
              batteries: {},
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
              batteries: {},
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
            if (deviceData.packData) {
              deviceData.packData.forEach((pack) => {
                this.devices[uuid].batteries[pack.sn] = pack;
              });
            }
          }
          break;
      }

      const zendureDeviceSensor: ZendureDeviceSensor[] = [];
      for (const [deviceKey, device] of Object.entries(this.devices)) {
        for (const [sensorKey, sensor] of Object.entries(device.sensors)) {
          // console.log(sensorKey, sensorValue);
          zendureDeviceSensor.push({
            ...sensor,
            name: `${deviceKey} ${sensor.name}`,
          });
        }
      }
      console.log(zendureDeviceSensor);
      this.energySensors.next(zendureDeviceSensor);
    });
  }

  getSensorState(deviceUUID: string, sensorName: string, unit: string) {
    if (!this.states[deviceUUID]) {
      return '';
    }
    return (
      this.getSensorStateFormatedValue(deviceUUID, sensorName) ??
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

  getSensorStateFormatedValue(deviceUUID: string, sensorName: string) {
    switch (sensorName) {
      case 'remainOutTime':
        return this.states[deviceUUID][sensorName]
          ? Math.round(this.states[deviceUUID][sensorName] / 60)
          : this.states[deviceUUID][sensorName];
      default:
        return this.states[deviceUUID][sensorName];
    }
  }

  getModelNameBySerialNumber(
    serialNumber: string,
    defaultLabel = 'Produit inconnu'
  ) {
    const models = [
      { regex: /^EE1LHMH1M/, name: 'Hyper 2000' },
      { regex: /^CO4FHMEFM/, name: 'AB2000S' },
    ];

    for (const model of models) {
      if (model.regex.test(serialNumber)) {
        return model.name;
      }
    }

    return defaultLabel;
  }

  getDeviceBatteryLevel(deviceUUID: string) {
    return this.states[deviceUUID].electricLevel ?? null;
  }

  ngOnDestroy() {
    this.mqttService.close();
  }
}
