import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCategoriaCardComponent } from './main-categoria-card.component';

describe('MainCategoriaCardComponent', () => {
  let component: MainCategoriaCardComponent;
  let fixture: ComponentFixture<MainCategoriaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainCategoriaCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCategoriaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
