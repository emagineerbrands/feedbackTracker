import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallLogsActionViewHtmlRenderComponent } from './call-logs-action-view-html-render.component';

describe('CallLogsActionViewHtmlRenderComponent', () => {
  let component: CallLogsActionViewHtmlRenderComponent;
  let fixture: ComponentFixture<CallLogsActionViewHtmlRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallLogsActionViewHtmlRenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CallLogsActionViewHtmlRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
