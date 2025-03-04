import { TestBed } from '@angular/core/testing';

import { ZendureApiService } from './zendure-api.service';

describe('ZendureApiService', () => {
  let service: ZendureApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZendureApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
