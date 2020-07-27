import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguroEjecDialogComponent } from './seguro-ejec-dialog.component';

describe('SeguroEjecDialogComponent', () => {
  let component: SeguroEjecDialogComponent;
  let fixture: ComponentFixture<SeguroEjecDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguroEjecDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguroEjecDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
