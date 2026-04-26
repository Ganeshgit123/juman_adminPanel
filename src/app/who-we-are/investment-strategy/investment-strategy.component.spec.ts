import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentStrategyComponent } from './investment-strategy.component';

describe('InvestmentStrategyComponent', () => {
  let component: InvestmentStrategyComponent;
  let fixture: ComponentFixture<InvestmentStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentStrategyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
