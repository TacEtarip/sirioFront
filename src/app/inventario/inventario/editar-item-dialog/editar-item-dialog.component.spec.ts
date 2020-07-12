import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarItemDialogComponent } from './editar-item-dialog.component';

describe('EditarItemDialogComponent', () => {
  let component: EditarItemDialogComponent;
  let fixture: ComponentFixture<EditarItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
