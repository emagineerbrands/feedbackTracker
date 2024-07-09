import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingTrackerComponent } from './shipping-tracker.component';

describe('ShippingTrackerComponent', () => {
  let component: ShippingTrackerComponent;
  let fixture: ComponentFixture<ShippingTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShippingTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
