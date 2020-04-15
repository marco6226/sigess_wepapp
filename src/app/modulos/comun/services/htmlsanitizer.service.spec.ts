import { TestBed } from '@angular/core/testing';

import { HTMLSanitizerService } from './htmlsanitizer.service';

describe('HTMLSanitizerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HTMLSanitizerService = TestBed.get(HTMLSanitizerService);
    expect(service).toBeTruthy();
  });
});
