import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersStatusHtmlTableRenderComponent } from './users-status-html-table-render.component';

describe('UsersStatusHtmlTableRenderComponent', () => {
  let component: UsersStatusHtmlTableRenderComponent;
  let fixture: ComponentFixture<UsersStatusHtmlTableRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersStatusHtmlTableRenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersStatusHtmlTableRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
