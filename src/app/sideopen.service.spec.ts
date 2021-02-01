import { TestBed } from '@angular/core/testing';

import { SideopenService } from './sideopen.service';

describe('SideopenService', () => {
  let service: SideopenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideopenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
