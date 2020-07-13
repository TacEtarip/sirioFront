import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasCardComponent } from './ventas-card.component';

describe('VentasCardComponent', () => {
  let component: VentasCardComponent;
  let fixture: ComponentFixture<VentasCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
