import { TestBed } from '@angular/core/testing';

import {FizzBuzzBoomWsockService, FizzBuzzBoomWsockService} from './fizzbuzzboom-wsock.service';

describe('FizzBuzzBoomWsockService', () => {
  let service: FizzBuzzBoomWsockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FizzBuzzBoomWsockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
