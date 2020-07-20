import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarSubCategoriasComponent } from './agregar-sub-categorias.component';

describe('AgregarSubCategoriasComponent', () => {
  let component: AgregarSubCategoriasComponent;
  let fixture: ComponentFixture<AgregarSubCategoriasComponent>;

  beforeEach(async(() => {
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
