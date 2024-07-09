import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallLogsCustomDateFilterComponent } from './call-logs-custom-date-filter.component';

describe('CallLogsCustomDateFilterComponent', () => {
  let component: CallLogsCustomDateFilterComponent;
  let fixture: ComponentFixture<CallLogsCustomDateFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallLogsCustomDateFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CallLogsCustomDateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
