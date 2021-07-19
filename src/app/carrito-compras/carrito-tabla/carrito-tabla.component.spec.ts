import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoTablaComponent } from './carrito-tabla.component';

describe('CarritoTablaComponent', () => {
  let component: CarritoTablaComponent;
  let fixture: ComponentFixture<CarritoTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarritoTablaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarritoTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
