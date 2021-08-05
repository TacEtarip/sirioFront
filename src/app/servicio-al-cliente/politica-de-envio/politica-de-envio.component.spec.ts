import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaDeEnvioComponent } from './politica-de-envio.component';

describe('PoliticaDeEnvioComponent', () => {
  let component: PoliticaDeEnvioComponent;
  let fixture: ComponentFixture<PoliticaDeEnvioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoliticaDeEnvioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliticaDeEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
