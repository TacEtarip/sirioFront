import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCardVendComponent } from './item-card-vend.component';

describe('ItemCardVendComponent', () => {
  let component: ItemCardVendComponent;
  let fixture: ComponentFixture<ItemCardVendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemCardVendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardVendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
