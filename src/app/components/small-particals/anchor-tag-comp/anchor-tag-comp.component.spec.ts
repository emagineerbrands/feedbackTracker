import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnchorTagCompComponent } from './anchor-tag-comp.component';

describe('AnchorTagCompComponent', () => {
  let component: AnchorTagCompComponent;
  let fixture: ComponentFixture<AnchorTagCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnchorTagCompComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnchorTagCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
