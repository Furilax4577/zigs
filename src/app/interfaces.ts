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
