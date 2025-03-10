import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ZendureDeviceSensor } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ZendureSensorsService {
  private sensorsSubject = new BehaviorSubject<ZendureDeviceSensor[]>([]);
  public sensors = this.sensorsSubject.asObservable();

  constructor() {}

  updateSensors(sensors: ZendureDeviceSensor[]) {
    this.sensorsSubject.next(sensors);
  }
}
