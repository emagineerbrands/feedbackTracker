import { TestBed } from '@angular/core/testing';

import { WelcomeCallLogService } from './welcome-call-log.service';

describe('WelcomeCallLogService', () => {
  let service: WelcomeCallLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WelcomeCallLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
