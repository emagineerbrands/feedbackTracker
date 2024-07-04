import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnsTrackerListComponent } from './returns-tracker-list.component';

describe('ReturnsTrackerListComponent', () => {
  let component: ReturnsTrackerListComponent;
  let fixture: ComponentFixture<ReturnsTrackerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReturnsTrackerListComponent]
    });
    fixture = TestBed.createComponent(ReturnsTrackerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
