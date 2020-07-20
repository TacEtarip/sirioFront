import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarSubTipoComponent } from './eliminar-sub-tipo.component';

describe('EliminarSubTipoComponent', () => {
  let component: EliminarSubTipoComponent;
  let fixture: ComponentFixture<EliminarSubTipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarSubTipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarSubTipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
