import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucessfulPartnerComponent } from './sucessful-partner.component';

describe('SucessfulPartnerComponent', () => {
  let component: SucessfulPartnerComponent;
  let fixture: ComponentFixture<SucessfulPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucessfulPartnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SucessfulPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
