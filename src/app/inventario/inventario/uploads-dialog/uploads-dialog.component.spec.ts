import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadsDialogComponent } from './uploads-dialog.component';

describe('UploadsDialogComponent', () => {
  let component: UploadsDialogComponent;
  let fixture: ComponentFixture<UploadsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
