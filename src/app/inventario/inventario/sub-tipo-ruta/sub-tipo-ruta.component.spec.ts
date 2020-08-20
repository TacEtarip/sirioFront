import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTipoRutaComponent } from './sub-tipo-ruta.component';

describe('SubTipoRutaComponent', () => {
  let component: SubTipoRutaComponent;
  let fixture: ComponentFixture<SubTipoRutaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTipoRutaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTipoRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
