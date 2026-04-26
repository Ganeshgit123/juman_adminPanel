import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatingComponent } from './operating.component';

describe('OperatingComponent', () => {
  let component: OperatingComponent;
  let fixture: ComponentFixture<OperatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
