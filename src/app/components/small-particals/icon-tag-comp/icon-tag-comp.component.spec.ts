import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTagCompComponent } from './icon-tag-comp.component';

describe('IconTagCompComponent', () => {
  let component: IconTagCompComponent;
  let fixture: ComponentFixture<IconTagCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconTagCompComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconTagCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
