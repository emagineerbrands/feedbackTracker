import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallLogsDashboardComponent } from './call-logs-dashboard.component';

describe('CallLogsDashboardComponent', () => {
  let component: CallLogsDashboardComponent;
  let fixture: ComponentFixture<CallLogsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallLogsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CallLogsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
