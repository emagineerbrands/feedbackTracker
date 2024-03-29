import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTableComponent } from './chart-table.component';

describe('ChartTableComponent', () => {
  let component: ChartTableComponent;
  let fixture: ComponentFixture<ChartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
