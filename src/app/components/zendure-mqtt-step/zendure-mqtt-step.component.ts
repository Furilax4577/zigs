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
import { ZendureSensorsService } from '../../services/zendure-sensors.service';

@Component({
  selector: 'app-zendure-mqtt-step',
  imports: [CommonModule, KeyValuePipe, FontAwesomeModule],
  templateUrl: './zendure-mqtt-step.component.html',
  styleUrl: './zendure-mqtt-step.component.scss',
})
export class ZendureMqttStepComponent {
  @Input({ required: true }) zendureMQTTForm!: FormGroup;
  @Output() updatedSensors = new EventEmitter<ZendureDeviceSensor[]>();

  infoIcon = faInfoCircle;
  messageCount: number = 0;

  inverterNameModalOpened: boolean = false;
  batteriesModalOpened: boolean = false;

  sensors: { [key: string]: ZendureDeviceSensor } = {};
  devices: { [key: string]: ZendureDevice } = {};
  states: { [key: string]: ZendureMessageState } = {};

  private _sensorArray: ZendureDeviceSensor[] = [];

  constructor(
    private mqttService: MqttService,
    private zendureSensorsService: ZendureSensorsService
  ) {}

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

          if (!this.sensors[deviceSensor.unique_id]) {
            // Détection d'un nouveau capteur
            this.sensors[deviceSensor.unique_id] =
              this.nameKeyFirstPosition(deviceSensor);
            const sensors = Object.entries(this.sensors).map(
              ([key, sensor]) => {
                return sensor;
              }
            );
            this.zendureSensorsService.updateSensors(sensors);
          }

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

  getObjectCount(object: Object): number {
    return Object.keys(object).length;
  }

  nameKeyFirstPosition(sensor: ZendureDeviceSensor): ZendureDeviceSensor {
    const removed = this.removeKeys(sensor, ['name']);
    return { name: sensor.name, ...removed };
  }

  removeKeys<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> {
    const newObj = { ...obj };
    keys.forEach((key) => delete newObj[key]);
    return newObj;
  }

  ngOnDestroy() {
    this.mqttService.close();
  }
}
