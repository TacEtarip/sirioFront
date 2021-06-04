import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeFoldersComponent } from './change-folders.component';

describe('ChangeFoldersComponent', () => {
  let component: ChangeFoldersComponent;
  let fixture: ComponentFixture<ChangeFoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeFoldersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
