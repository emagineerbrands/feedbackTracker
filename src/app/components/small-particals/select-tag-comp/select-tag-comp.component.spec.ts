import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTagCompComponent } from './select-tag-comp.component';

describe('SelectTagCompComponent', () => {
  let component: SelectTagCompComponent;
  let fixture: ComponentFixture<SelectTagCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTagCompComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectTagCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
