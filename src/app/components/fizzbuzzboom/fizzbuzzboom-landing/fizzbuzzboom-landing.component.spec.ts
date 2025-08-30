import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FizzbuzzboomLandingComponent } from './fizzbuzzboom-landing.component';

describe('FizzbuzzboomLandingComponent', () => {
  let component: FizzbuzzboomLandingComponent;
  let fixture: ComponentFixture<FizzbuzzboomLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FizzbuzzboomLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FizzbuzzboomLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
