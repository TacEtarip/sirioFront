import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPlegableComponent } from './lista-plegable.component';

describe('ListaPlegableComponent', () => {
  let component: ListaPlegableComponent;
  let fixture: ComponentFixture<ListaPlegableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPlegableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPlegableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
