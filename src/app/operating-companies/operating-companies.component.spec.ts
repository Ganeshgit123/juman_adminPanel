import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatingCompaniesComponent } from './operating-companies.component';

describe('OperatingCompaniesComponent', () => {
  let component: OperatingCompaniesComponent;
  let fixture: ComponentFixture<OperatingCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatingCompaniesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatingCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
