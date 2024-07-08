import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveTicketConfirmComponent } from './remove-ticket-confirm.component';

describe('RemoveTicketConfirmComponent', () => {
  let component: RemoveTicketConfirmComponent;
  let fixture: ComponentFixture<RemoveTicketConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemoveTicketConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveTicketConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
