import { TestBed } from '@angular/core/testing';

import { CasosMedicosService } from './casos-medicos.service';

describe('CasosMedicosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CasosMedicosService = TestBed.get(CasosMedicosService);
    expect(service).toBeTruthy();
  });
});
