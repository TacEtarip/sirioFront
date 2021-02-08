import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Eject404Component } from './eject404.component';

describe('Eject404Component', () => {
  let component: Eject404Component;
  let fixture: ComponentFixture<Eject404Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Eject404Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Eject404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
