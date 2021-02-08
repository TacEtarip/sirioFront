import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditarCantidadesDialogComponent } from './editar-cantidades-dialog.component';

describe('EditarCantidadesDialogComponent', () => {
  let component: EditarCantidadesDialogComponent;
  let fixture: ComponentFixture<EditarCantidadesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarCantidadesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCantidadesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
