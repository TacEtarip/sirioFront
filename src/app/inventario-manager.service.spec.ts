import { TestBed } from '@angular/core/testing';

import { InventarioManagerService } from './inventario-manager.service';

describe('InventarioManagerService', () => {
  let service: InventarioManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventarioManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
