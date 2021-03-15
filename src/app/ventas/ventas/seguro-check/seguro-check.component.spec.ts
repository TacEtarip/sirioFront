import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguroCheckComponent } from './seguro-check.component';

describe('SeguroCheckComponent', () => {
  let component: SeguroCheckComponent;
  let fixture: ComponentFixture<SeguroCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguroCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguroCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
