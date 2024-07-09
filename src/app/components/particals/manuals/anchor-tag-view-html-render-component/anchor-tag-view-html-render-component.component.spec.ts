import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnchorTagViewHtmlRenderComponent } from './anchor-tag-view-html-render-component.component';

describe('AnchorTagViewHtmlRenderComponentComponent', () => {
  let component: AnchorTagViewHtmlRenderComponent;
  let fixture: ComponentFixture<AnchorTagViewHtmlRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnchorTagViewHtmlRenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnchorTagViewHtmlRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
