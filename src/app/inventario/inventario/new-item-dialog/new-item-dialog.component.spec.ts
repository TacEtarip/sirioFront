import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewItemDialogComponent } from './new-item-dialog.component';

describe('NewItemDialogComponent', () => {
  let component: NewItemDialogComponent;
  let fixture: ComponentFixture<NewItemDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
