import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackTrackerComponent } from './feedback-tracker.component';

describe('FeedbackTrackerComponent', () => {
  let component: FeedbackTrackerComponent;
  let fixture: ComponentFixture<FeedbackTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackTrackerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeedbackTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
