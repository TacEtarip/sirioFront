import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCatImageComponent } from './upload-cat-image.component';

describe('UploadCatImageComponent', () => {
  let component: UploadCatImageComponent;
  let fixture: ComponentFixture<UploadCatImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCatImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCatImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
