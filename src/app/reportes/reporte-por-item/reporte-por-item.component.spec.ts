import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePorItemComponent } from './reporte-por-item.component';

describe('ReportePorItemComponent', () => {
  let component: ReportePorItemComponent;
  let fixture: ComponentFixture<ReportePorItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportePorItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
