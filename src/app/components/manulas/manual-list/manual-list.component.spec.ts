import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualListComponent } from './manual-list.component';

describe('ManualListComponent', () => {
  let component: ManualListComponent;
  let fixture: ComponentFixture<ManualListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManualListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
