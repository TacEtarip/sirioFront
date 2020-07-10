import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarClaseItemComponent } from './agregar-clase-item.component';

describe('AgregarClaseItemComponent', () => {
  let component: AgregarClaseItemComponent;
  let fixture: ComponentFixture<AgregarClaseItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarClaseItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarClaseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
