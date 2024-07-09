import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManualComponent } from './add-manual.component';

describe('AddManualComponent', () => {
  let component: AddManualComponent;
  let fixture: ComponentFixture<AddManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddManualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
