import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableRowRendererComponent } from './expandable-row-renderer.component';

describe('ExpandableRowRendererComponent', () => {
  let component: ExpandableRowRendererComponent;
  let fixture: ComponentFixture<ExpandableRowRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpandableRowRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandableRowRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
