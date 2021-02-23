import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionCardComponent } from './cotizacion-card.component';

describe('CotizacionCardComponent', () => {
  let component: CotizacionCardComponent;
  let fixture: ComponentFixture<CotizacionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
