import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarContrasenaDialogComponent } from './cambiar-contrasena-dialog.component';

describe('CambiarContrasenaDialogComponent', () => {
  let component: CambiarContrasenaDialogComponent;
  let fixture: ComponentFixture<CambiarContrasenaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarContrasenaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarContrasenaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
