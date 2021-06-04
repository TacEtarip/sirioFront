import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSubCatImageComponent } from './upload-sub-cat-image.component';

describe('UploadSubCatImageComponent', () => {
  let component: UploadSubCatImageComponent;
  let fixture: ComponentFixture<UploadSubCatImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadSubCatImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSubCatImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
