import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGroupingTableComponent } from './product-grouping-table.component';

describe('ProductGroupingTableComponent', () => {
  let component: ProductGroupingTableComponent;
  let fixture: ComponentFixture<ProductGroupingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductGroupingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductGroupingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
