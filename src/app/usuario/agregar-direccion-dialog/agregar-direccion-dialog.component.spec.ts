import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarDireccionDialogComponent } from './agregar-direccion-dialog.component';

describe('AgregarDireccionDialogComponent', () => {
  let component: AgregarDireccionDialogComponent;
  let fixture: ComponentFixture<AgregarDireccionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarDireccionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarDireccionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
