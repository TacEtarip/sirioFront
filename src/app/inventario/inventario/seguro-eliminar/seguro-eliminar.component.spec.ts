import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguroEliminarComponent } from './seguro-eliminar.component';

describe('SeguroEliminarComponent', () => {
  let component: SeguroEliminarComponent;
  let fixture: ComponentFixture<SeguroEliminarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguroEliminarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguroEliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
