import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCelularDialogComponent } from './editar-celular-dialog.component';

describe('EditarCelularDialogComponent', () => {
  let component: EditarCelularDialogComponent;
  let fixture: ComponentFixture<EditarCelularDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarCelularDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCelularDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
