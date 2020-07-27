import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaActivaCardComponent } from './venta-activa-card.component';

describe('VentaActivaCardComponent', () => {
  let component: VentaActivaCardComponent;
  let fixture: ComponentFixture<VentaActivaCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaActivaCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaActivaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
