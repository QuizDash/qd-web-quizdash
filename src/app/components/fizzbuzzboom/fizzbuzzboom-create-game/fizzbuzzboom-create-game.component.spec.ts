import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FizzBuzzBoomCreateGameComponent } from './fizzbuzzboom-create-game.component';

describe('FizzbuzzboomCreateGameComponent', () => {
  let component: FizzBuzzBoomCreateGameComponent;
  let fixture: ComponentFixture<v>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FizzBuzzBoomCreateGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FizzBuzzBoomCreateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
