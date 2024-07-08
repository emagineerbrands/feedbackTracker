import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesRemoveCheckComponent } from './images-remove-check.component';

describe('ImagesRemoveCheckComponent', () => {
  let component: ImagesRemoveCheckComponent;
  let fixture: ComponentFixture<ImagesRemoveCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImagesRemoveCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagesRemoveCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
