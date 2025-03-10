import { Component } from '@angular/core';
import * as YAML from 'yaml';

@Component({
  selector: 'app-hass-config-step',
  imports: [],
  templateUrl: './hass-config-step.component.html',
  styleUrl: './hass-config-step.component.scss',
})
export class HassConfigStepComponent {
  test = YAML.stringify({
    sensor: [
      {
        name: 'Zendure 1 solarInputPower',
        state_topic: 'MH7dA2cl/9644SUXD/state',
        value_template: '{{ value_json.solarInputPower }}',
        unit_of_measurement: 'W',
        device_class: 'power',
        state_class: 'measurement',
      },
      {
        name: 'Zendure 1 solarInputPower',
        state_topic: 'MH7dA2cl/9644SUXD/state',
        value_template: '{{ value_json.solarInputPower }}',
        unit_of_measurement: 'W',
        device_class: 'power',
        state_class: 'measurement',
      },
    ],
  });

  constructor() {}
}
