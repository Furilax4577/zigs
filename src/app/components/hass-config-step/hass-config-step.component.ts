import { Component } from '@angular/core';
import * as YAML from 'yaml';
import { ZendureSensorsService } from '../../services/zendure-sensors.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hass-config-step',
  imports: [CommonModule],
  templateUrl: './hass-config-step.component.html',
  styleUrl: './hass-config-step.component.scss',
})
export class HassConfigStepComponent {
  sensors: string = '';
  integrations: string = '';
  checkboxes: string[] = [
    'outputHomePower',
    'solarInputPower',
    'gridInputPower',
  ];
  checkedboxes: string[] = [
    'outputHomePower',
    'solarInputPower',
    'gridInputPower',
  ];
  // zendure_1_solarinputpower
  // zendure_1_gridinputpower
  // zendure_1_outputhomepower

  constructor(private zendureSensorsService: ZendureSensorsService) {
    this.zendureSensorsService.sensors.subscribe((sensors) => {
      if (sensors.length) {
        this.checkboxes = sensors.map((sensor) => {
          return sensor.name;
        });

        // Génération des capteurs
        this.sensors = YAML.stringify([{ sensors: sensors }]);

        // Génération des integrations
        this.integrations = YAML.stringify([
          {
            platform: 'integration',
            source: 'sensor.consommation_reseau_edf',
            name: 'Consommation Réseau EDF kWh',
            unit_prefix: 'k',
            round: 2,
            method: 'trapezoidal',
          },
        ]);
      }
    });
  }

  isChecked(checkbox: string) {
    return this.checkedboxes.indexOf(checkbox) !== -1;
  }
}
