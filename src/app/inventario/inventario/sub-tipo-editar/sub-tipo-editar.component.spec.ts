import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubTipoEditarComponent } from './sub-tipo-editar.component';

describe('SubTipoEditarComponent', () => {
  let component: SubTipoEditarComponent;
  let fixture: ComponentFixture<SubTipoEditarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTipoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTipoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
