import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArithmeticQuizComponent } from './arithmetic-quiz.component';

describe('ArithmeticQuizComponent', () => {
  let component: ArithmeticQuizComponent;
  let fixture: ComponentFixture<ArithmeticQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArithmeticQuizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArithmeticQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
