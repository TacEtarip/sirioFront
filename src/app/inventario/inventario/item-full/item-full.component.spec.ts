import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFullComponent } from './item-full.component';

describe('ItemFullComponent', () => {
  let component: ItemFullComponent;
  let fixture: ComponentFixture<ItemFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
