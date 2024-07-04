import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallLogsSelectFilterComponent } from './call-logs-select-filter.component';

describe('CallLogsSelectFilterComponent', () => {
  let component: CallLogsSelectFilterComponent;
  let fixture: ComponentFixture<CallLogsSelectFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallLogsSelectFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CallLogsSelectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
