import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentaIndHistoriaComponent } from './venta-ind-historia.component';

describe('VentaIndHistoriaComponent', () => {
  let component: VentaIndHistoriaComponent;
  let fixture: ComponentFixture<VentaIndHistoriaComponent>;

  beforeEach(waitForAsync(() => {
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
