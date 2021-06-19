import { TestBed } from '@angular/core/testing';

import { JsonLDServiceService } from './json-ldservice.service';

describe('JsonLDServiceService', () => {
  let service: JsonLDServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonLDServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
