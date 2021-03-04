import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreExcelDialogComponent } from './pre-excel-dialog.component';

describe('PreExcelDialogComponent', () => {
  let component: PreExcelDialogComponent;
  let fixture: ComponentFixture<PreExcelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreExcelDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreExcelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
