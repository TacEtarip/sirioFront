import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SeguroAnularComponent } from './seguro-anular.component';

describe('SeguroAnularComponent', () => {
  let component: SeguroAnularComponent;
  let fixture: ComponentFixture<SeguroAnularComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguroAnularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguroAnularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
