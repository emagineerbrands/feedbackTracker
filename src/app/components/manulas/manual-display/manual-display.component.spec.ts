import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualDisplayComponent } from './manual-display.component';

describe('ManualDisplayComponent', () => {
  let component: ManualDisplayComponent;
  let fixture: ComponentFixture<ManualDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManualDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
