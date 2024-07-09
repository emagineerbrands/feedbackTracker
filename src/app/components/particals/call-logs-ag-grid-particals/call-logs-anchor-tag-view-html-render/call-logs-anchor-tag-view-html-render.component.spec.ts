import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallLogsAnchorTagViewHtmlRenderComponent } from './call-logs-anchor-tag-view-html-render.component';

describe('CallLogsAnchorTagViewHtmlRenderComponent', () => {
  let component: CallLogsAnchorTagViewHtmlRenderComponent;
  let fixture: ComponentFixture<CallLogsAnchorTagViewHtmlRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallLogsAnchorTagViewHtmlRenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CallLogsAnchorTagViewHtmlRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
