import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShowItemTemporalComponent } from './show-item-temporal.component';

describe('ShowItemTemporalComponent', () => {
  let component: ShowItemTemporalComponent;
  let fixture: ComponentFixture<ShowItemTemporalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowItemTemporalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowItemTemporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
