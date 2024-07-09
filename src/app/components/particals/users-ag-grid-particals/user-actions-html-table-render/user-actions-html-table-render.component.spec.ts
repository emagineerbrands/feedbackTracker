import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActionsHtmlTableRenderComponent } from './user-actions-html-table-render.component';

describe('UserActionsHtmlTableRenderComponent', () => {
  let component: UserActionsHtmlTableRenderComponent;
  let fixture: ComponentFixture<UserActionsHtmlTableRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActionsHtmlTableRenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserActionsHtmlTableRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
