import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderSearchFiltersComponent } from './shopify-order-search-filters.component';

describe('ShopifyOrderSearchFiltersComponent', () => {
  let component: ShopifyOrderSearchFiltersComponent;
  let fixture: ComponentFixture<ShopifyOrderSearchFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopifyOrderSearchFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderSearchFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
