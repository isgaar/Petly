import { TestBed } from '@angular/core/testing';

import { CarreolaService } from './carreola.service';

describe('CarreolaService', () => {
  let service: CarreolaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarreolaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
