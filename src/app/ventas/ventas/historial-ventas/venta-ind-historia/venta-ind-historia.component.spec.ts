import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaIndHistoriaComponent } from './venta-ind-historia.component';

describe('VentaIndHistoriaComponent', () => {
  let component: VentaIndHistoriaComponent;
  let fixture: ComponentFixture<VentaIndHistoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaIndHistoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaIndHistoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
