import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullCotiComponent } from './full-coti.component';

describe('FullCotiComponent', () => {
  let component: FullCotiComponent;
  let fixture: ComponentFixture<FullCotiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullCotiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullCotiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
