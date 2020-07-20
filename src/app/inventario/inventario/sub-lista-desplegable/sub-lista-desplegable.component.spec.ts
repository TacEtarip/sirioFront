import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubListaDesplegableComponent } from './sub-lista-desplegable.component';

describe('SubListaDesplegableComponent', () => {
  let component: SubListaDesplegableComponent;
  let fixture: ComponentFixture<SubListaDesplegableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubListaDesplegableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubListaDesplegableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
