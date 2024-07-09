import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardChartHeaderComponent } from './card-chart-header.component';

describe('CardChartHeaderComponent', () => {
  let component: CardChartHeaderComponent;
  let fixture: ComponentFixture<CardChartHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardChartHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardChartHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
