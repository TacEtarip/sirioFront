import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PostVentaComponent } from './post-venta.component';

describe('PostVentaComponent', () => {
  let component: PostVentaComponent;
  let fixture: ComponentFixture<PostVentaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PostVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
