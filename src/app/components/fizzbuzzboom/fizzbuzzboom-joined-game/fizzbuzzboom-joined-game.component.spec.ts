import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FizzBuzzBoomJoinedGameComponent } from './fizzbuzzboom-joined-game.component';

describe('FizzbuzzboomJoinedGameComponent', () => {
  let component: FizzBuzzBoomJoinedGameComponent;
  let fixture: ComponentFixture<FizzBuzzBoomJoinedGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FizzBuzzBoomJoinedGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FizzBuzzBoomJoinedGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
