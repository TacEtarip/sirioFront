import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarClaseComponent } from './editar-clase.component';

describe('EditarClaseComponent', () => {
  let component: EditarClaseComponent;
  let fixture: ComponentFixture<EditarClaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarClaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
