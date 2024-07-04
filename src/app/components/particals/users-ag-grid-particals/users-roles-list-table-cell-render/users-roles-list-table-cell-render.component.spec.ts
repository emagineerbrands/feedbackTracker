import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersRolesListTableCellRenderComponent } from './users-roles-list-table-cell-render.component';

describe('UsersRolesListTableCellRenderComponent', () => {
  let component: UsersRolesListTableCellRenderComponent;
  let fixture: ComponentFixture<UsersRolesListTableCellRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersRolesListTableCellRenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersRolesListTableCellRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
