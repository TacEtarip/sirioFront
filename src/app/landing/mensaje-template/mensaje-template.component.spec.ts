import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeTemplateComponent } from './mensaje-template.component';

describe('MensajeTemplateComponent', () => {
  let component: MensajeTemplateComponent;
  let fixture: ComponentFixture<MensajeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensajeTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
