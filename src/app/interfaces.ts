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

export interface ZendureMockedData {
  api: {
    appKey: string;
    secret: string;
    mqttUrl: string;
    port: number;
  };
  form: {
    snNumber: string;
    account: string;
  };
}
