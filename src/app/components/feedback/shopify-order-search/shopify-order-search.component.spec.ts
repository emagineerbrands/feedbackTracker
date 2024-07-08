import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderSearchComponent } from './shopify-order-search.component';

describe('ShopifyOrderSearchComponent', () => {
  let component: ShopifyOrderSearchComponent;
  let fixture: ComponentFixture<ShopifyOrderSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopifyOrderSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
