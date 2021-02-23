import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarCotiComponent } from './generar-coti.component';

describe('GenerarCotiComponent', () => {
  let component: GenerarCotiComponent;
  let fixture: ComponentFixture<GenerarCotiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarCotiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarCotiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
