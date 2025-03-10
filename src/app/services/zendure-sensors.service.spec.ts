import { TestBed } from '@angular/core/testing';

import { ZendureSensorsService } from './zendure-sensors.service';

describe('ZendureSensorsService', () => {
  let service: ZendureSensorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZendureSensorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
