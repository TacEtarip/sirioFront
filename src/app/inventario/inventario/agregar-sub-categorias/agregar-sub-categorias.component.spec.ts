import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgregarSubCategoriasComponent } from './agregar-sub-categorias.component';

describe('AgregarSubCategoriasComponent', () => {
  let component: AgregarSubCategoriasComponent;
  let fixture: ComponentFixture<AgregarSubCategoriasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarSubCategoriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarSubCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
