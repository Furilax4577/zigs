import { TestBed } from '@angular/core/testing';

import { ZendureDevicesService } from './zendure-devices.service';

describe('ZendureDevicesService', () => {
  let service: ZendureDevicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZendureDevicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
