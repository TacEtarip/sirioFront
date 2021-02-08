import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MarcasDialogComponent } from './marcas-dialog.component';

describe('MarcasDialogComponent', () => {
  let component: MarcasDialogComponent;
  let fixture: ComponentFixture<MarcasDialogComponent>;

  beforeEach(waitForAsync(() => {
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
