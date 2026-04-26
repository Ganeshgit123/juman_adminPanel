import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardDirectorComponent } from './board-director.component';

describe('BoardDirectorComponent', () => {
  let component: BoardDirectorComponent;
  let fixture: ComponentFixture<BoardDirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardDirectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardDirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
