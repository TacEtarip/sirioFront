import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcasDialogComponent } from './marcas-dialog.component';

describe('MarcasDialogComponent', () => {
  let component: MarcasDialogComponent;
  let fixture: ComponentFixture<MarcasDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarcasDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcasDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
