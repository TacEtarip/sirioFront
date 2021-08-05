import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioAlClienteComponent } from './servicio-al-cliente.component';

describe('ServicioAlClienteComponent', () => {
  let component: ServicioAlClienteComponent;
  let fixture: ComponentFixture<ServicioAlClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicioAlClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicioAlClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
