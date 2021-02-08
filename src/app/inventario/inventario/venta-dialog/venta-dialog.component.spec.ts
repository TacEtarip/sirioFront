import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentaDialogComponent } from './venta-dialog.component';

describe('VentaDialogComponent', () => {
  let component: VentaDialogComponent;
  let fixture: ComponentFixture<VentaDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
