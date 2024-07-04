import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnsOrderSearchComponent } from './returns-order-search.component';

describe('ReturnsOrderSearchComponent', () => {
  let component: ReturnsOrderSearchComponent;
  let fixture: ComponentFixture<ReturnsOrderSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReturnsOrderSearchComponent]
    });
    fixture = TestBed.createComponent(ReturnsOrderSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
