import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionViewHtmlRenderComponent } from './action-view-html-render.component';

describe('ActionViewHtmlRenderComponent', () => {
  let component: ActionViewHtmlRenderComponent;
  let fixture: ComponentFixture<ActionViewHtmlRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionViewHtmlRenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionViewHtmlRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
