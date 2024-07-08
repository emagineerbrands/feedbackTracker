import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuAutoCompleteComponent } from './sku-auto-complete.component';

describe('SkuAutoCompleteComponent', () => {
  let component: SkuAutoCompleteComponent;
  let fixture: ComponentFixture<SkuAutoCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkuAutoCompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkuAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
