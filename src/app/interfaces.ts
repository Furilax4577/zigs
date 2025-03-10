export interface ZendureApiResponse {
  code: number;
  success: boolean;
  data: {
    appKey: string;
    secret: string;
    mqttUrl: string;
    port: number;
  };
  msg: string;
}

export interface ZendurePostData {
  account: string;
  snNumber: string;
}

export interface ZendureMqttConfig {
  appKey: string;
  secret: string;
  mqttUrl: string;
  port: number;
}

export interface ZendureMockedData {
  mqtt: ZendureMqttConfig;
  form: {
    snNumber: string;
    account: string;
  };
}

export interface MqttMessage {
  topic: string;
  message: ZendureMessageState | ZendureDeviceSwitch | ZendureDeviceSensor;
}

export interface ZendureMessageState {
  [key: string]: any;
  sn?: string;
  solarInputPower?: number;
  electricLevel?: number;
  outputPackPower?: number;
  solarPower1?: number;
  solarPower2?: number;
  hyperTmp?: number;
  packData?: ZendureMessageDevicePackData[];
  inverseMaxPower?: number;
  inputLimit?: number;
  outputLimit?: number;
  acMode?: number;
  remainOutTime?: number;
  outputHomePower?: number;
}

export interface ZendureMessageDevicePackData {
  sn: string;
  minVol: number;
  maxVol: number;
}

export interface ZendureDeviceBattery {
  sn: string;
  maxVol?: number;
  minVol?: number;
}

export interface ZendureDeviceSensor {
  name: string;
  command_topic: string;
  device_class: string;
  state_topic: string;
  unique_id: string;
  unit_of_measurement: string;
  value_template: string;
}

export interface ZendureDeviceSwitch {
  // todo
}

// Data aggregation
export interface ZendureDevice {
  uuid: string;
  sn: string;
  sensors: { [key: string]: ZendureDeviceSensor };
  switches: { [key: string]: ZendureDeviceSwitch };
  batteries: { [key: string]: ZendureDeviceBattery };
}

export interface ZendureDevices {
  [key: string]: ZendureDevice;
}
