import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarDocumentoDialogComponent } from './agregar-documento-dialog.component';

describe('AgregarDocumentoDialogComponent', () => {
  let component: AgregarDocumentoDialogComponent;
  let fixture: ComponentFixture<AgregarDocumentoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarDocumentoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarDocumentoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
