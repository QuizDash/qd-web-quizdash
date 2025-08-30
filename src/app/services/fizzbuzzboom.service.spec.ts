import { TestBed } from '@angular/core/testing';

import { FizzBuzzBoomService } from './fizzbuzzboom.service';

describe('FizzbuzzboomService', () => {
  let service: FizzBuzzBoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FizzBuzzBoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
