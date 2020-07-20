import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporalShowItemInfoComponent } from './temporal-show-item-info.component';

describe('TemporalShowItemInfoComponent', () => {
  let component: TemporalShowItemInfoComponent;
  let fixture: ComponentFixture<TemporalShowItemInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemporalShowItemInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporalShowItemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
