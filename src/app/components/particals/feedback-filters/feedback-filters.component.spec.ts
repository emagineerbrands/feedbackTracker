import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackFiltersComponent } from './feedback-filters.component';

describe('FeedbackFiltersComponent', () => {
  let component: FeedbackFiltersComponent;
  let fixture: ComponentFixture<FeedbackFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackFiltersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeedbackFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
