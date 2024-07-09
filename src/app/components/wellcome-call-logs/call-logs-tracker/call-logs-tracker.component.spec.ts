import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallLogsTrackerComponent } from './call-logs-tracker.component';

describe('CallLogsTrackerComponent', () => {
  let component: CallLogsTrackerComponent;
  let fixture: ComponentFixture<CallLogsTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallLogsTrackerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CallLogsTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
