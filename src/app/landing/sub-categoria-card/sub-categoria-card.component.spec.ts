import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategoriaCardComponent } from './sub-categoria-card.component';

describe('SubCategoriaCardComponent', () => {
  let component: SubCategoriaCardComponent;
  let fixture: ComponentFixture<SubCategoriaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubCategoriaCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoriaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
