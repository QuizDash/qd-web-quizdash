import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Message, MessageService} from 'primeng/api';
import {MessagesModule} from "primeng/messages";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";

@Component({
  selector: 'app-arithmetic-quiz',
  templateUrl: './arithmetic-quiz.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, MessagesModule, NgIf],
  styleUrls: ['./arithmetic-quiz.component.scss']
})
export class ArithmeticQuizComponent implements AfterViewInit  {

  isQuizStarted = false;
  isQuizFinished = false;
  questions: Question[] = [];
  index = -1;
  questionCount = 10;
  score = 0;

  isAdditionIncluded = true;
  isSubtractionIncluded = true;
  isMultiplicationIncluded = true;
  isDivisionIncluded = true;
  timeLimitSecs = 5;
  difficulty = 3;

  constructor(private messageService: MessageService) {}

  ngAfterViewInit(): void {

  }

  onGoClick(): void {

    const self = this;
    this.index = -1;
    this.score = 0;

    if (!this.isAdditionIncluded && !this.isSubtractionIncluded && !this.isMultiplicationIncluded && !this.isDivisionIncluded) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'At least 1 option must be selected'});
      return;
    }

    let i = 0;
    while ( i < this.questionCount) {
      const questionType = Math.floor(Math.random() * 4);
      if (questionType === 0 && !this.isAdditionIncluded || questionType === 1 && !this.isSubtractionIncluded
      || questionType === 2 && !this.isMultiplicationIncluded || questionType === 3 && !this.isDivisionIncluded) {
        console.log('skipped');
      }
      else {
        const q: Question = new Question(i, questionType, this.difficulty);
        this.questions.push(q);
        i++;
      }
    }
    this.isQuizStarted = true;
    this.isQuizFinished = false;
    self.onSubmit();
  }

  onSubmit(): void {
    const self = this;
    this.index++;
    // Have completed all questions?
    if (this.index >= this.questionCount) {
      this.isQuizStarted = false;
      this.isQuizFinished = true;
    }
    else {
      setTimeout(() => {
        const q = this.questions[self.index];
        if (q.answer === q.submittedAnswer) {
          this.score++;
        }
        self.onSubmit();
      }, self.timeLimitSecs * 1000);
    }
  }

  validateOptions(): boolean {
    if (!this.isAdditionIncluded && !this.isSubtractionIncluded && !this.isMultiplicationIncluded && !this.isDivisionIncluded) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'At least 1 option must be selected'});
      console.log('invalid');
      return false;
    }
    console.log('valid');
    return true;
  }
}

class Question {
  index;
  operand1;
  operand2;
  operator;
  answer;
  submittedAnswer: any;
  rand;

  constructor(index: number, questionType: number, difficulty: number) {
    this.index = index;

    this.rand = questionType;
    switch (questionType) {
      case 0:
        this.operator = '+';
        this.operand1 = Math.round(Math.random() * 10 * difficulty + 2 * difficulty);
        this.operand2 = Math.round(Math.random() *  10 * difficulty + 2 * difficulty);
        this.answer = this.operand1 + this.operand2;
        break;

      case 1:
        this.operator = '-';
        const tmp1 = Math.round(Math.random() * 10 * difficulty + 2 * difficulty);
        const tmp2 = Math.round(Math.random() * 10 * difficulty + 2 * difficulty);
        if (tmp1 > tmp2 && difficulty < 6) {
          this.operand1 = tmp1;
          this.operand2 = tmp2;
        }
        else {
          this.operand1 = tmp2;
          this.operand2 = tmp1;
        }
        this.answer = this.operand1 - this.operand2;
        break;

      case 2:
        this.operator = 'x';
        this.operand1 = Math.round(Math.random() * (2 + difficulty * 2) + 2);
        this.operand2 = Math.round(Math.random() * (2 + difficulty * 2) + 2);
        this.answer = this.operand1 * this.operand2;
        break;

      case 3:
        this.operator = '/';
        const tmp = Math.round(Math.random() * (2 + difficulty * 2) + 2);
        this.operand2 = Math.round(Math.random() * (2 + difficulty * 2) + 2);
        this.operand1 = tmp * this.operand2;
        this.answer = this.operand1 / this.operand2;
        break;
    }
    console.log(this);

    this.submittedAnswer = null;
  }
}
