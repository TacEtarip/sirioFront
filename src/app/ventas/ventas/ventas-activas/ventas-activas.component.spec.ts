import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasActivasComponent } from './ventas-activas.component';

describe('VentasActivasComponent', () => {
  let component: VentasActivasComponent;
  let fixture: ComponentFixture<VentasActivasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasActivasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasActivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
