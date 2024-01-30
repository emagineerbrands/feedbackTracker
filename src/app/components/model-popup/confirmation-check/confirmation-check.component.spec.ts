import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationCheckComponent } from './confirmation-check.component';

describe('ConfirmationCheckComponent', () => {
  let component: ConfirmationCheckComponent;
  let fixture: ComponentFixture<ConfirmationCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmationCheckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmationCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
