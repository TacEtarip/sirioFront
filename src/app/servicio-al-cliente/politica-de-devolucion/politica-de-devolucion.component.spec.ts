import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaDeDevolucionComponent } from './politica-de-devolucion.component';

describe('PoliticaDeDevolucionComponent', () => {
  let component: PoliticaDeDevolucionComponent;
  let fixture: ComponentFixture<PoliticaDeDevolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoliticaDeDevolucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliticaDeDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
