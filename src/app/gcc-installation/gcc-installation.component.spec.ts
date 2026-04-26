import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GccInstallationComponent } from './gcc-installation.component';

describe('GccInstallationComponent', () => {
  let component: GccInstallationComponent;
  let fixture: ComponentFixture<GccInstallationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GccInstallationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GccInstallationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
