import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FizzbuzzboomLoadTestComponent } from './fizzbuzzboom-load-test.component';

describe('FizzbuzzboomLoadTestComponent', () => {
  let component: FizzbuzzboomLoadTestComponent;
  let fixture: ComponentFixture<FizzbuzzboomLoadTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FizzbuzzboomLoadTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FizzbuzzboomLoadTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
