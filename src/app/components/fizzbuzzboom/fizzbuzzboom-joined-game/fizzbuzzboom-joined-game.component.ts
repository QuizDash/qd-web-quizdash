import {Component, OnInit, ViewChild} from '@angular/core';
import {FizzBuzzBoomService} from '../../../services/fizzbuzzboom.service';
import {FizzBuzzBoomWsockService} from '../../../services/fizzbuzzboom-wsock.service';
import {MessageService} from 'primeng/api';
import {IUserConnected} from '../../../models/events/user-connected.interface';
import {IQuestionPosted} from '../../../models/events/question-posted.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from "../../../services/authentication.service";
import {FormsModule} from "@angular/forms";
import {ListboxModule} from "primeng/listbox";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {NgIf} from "@angular/common";
import {CountdownComponent, CountdownConfig} from "ngx-countdown";
import {TableModule} from "primeng/table";
import {ISession} from "../../../models/session.interface";

@Component({
  selector: 'app-fizzbuzzboom-joined-game',
  templateUrl: './fizzbuzzboom-joined-game.component.html',
  standalone: true,
  imports: [FormsModule, ListboxModule, ConfirmDialogModule, ToastModule, ProgressSpinnerModule, NgIf, CountdownComponent, TableModule],
  styleUrls: ['./fizzbuzzboom-joined-game.component.scss']
})
export class FizzBuzzBoomJoinedGameComponent implements OnInit {
  @ViewChild('cd', { static: false }) public countdown!: CountdownComponent;
  config: CountdownConfig = { leftTime: 5, demand: true };
  answer: string = '';
  errorMsg: string = '';
  infoMsg: string = '';
  isLoading = false;
  isWaiting = false;
  sessionId: string = '';
  users: IUserConnected[] = [];
  targetUser: string = '';
  myNickname: string = '';
  isTargetUser = false;
  sub: any;
  hasAnswered = false;
  isGameWon = false;
  session: ISession = {
    fizzMultiple: 3,
    buzzMultiple: 5,
    isRandomQuestion: false,
    maxRandomValue: -1,
    timeLimitSeconds: 5
  };

  protected questionValue = 0;

  constructor(private auth: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute,
              private fbbService: FizzBuzzBoomService,
              private wsService: FizzBuzzBoomWsockService,
              private messageService: MessageService) {
    const self = this;

    this.sessionId = this.route.snapshot.paramMap.get('sessionId') || '';
    this.myNickname = this.route.snapshot.paramMap.get('nickname') || '';

    this.isLoading = true;

    this.fbbService.getGameSession(this.sessionId)
      .subscribe({
        next: s => {
          console.log(s);
          self.session = s;
          self.config = { leftTime: self.session.timeLimitSeconds, demand: true };
          self.isLoading = false;
        },
        error: err => {
          self.errorMsg = 'Invalid session token entered, please try again.'
          self.isLoading = false;
        },
        complete: () => {}
      });

    this.wsService?.subject?.subscribe(msg => {
      console.log(msg);
      const data = JSON.parse(msg.data);
      console.log(data);
      if(data.event && data.event == 'question' && !self.isGameWon) {
        this.hasAnswered = false;
        const qnEvent: IQuestionPosted = data;
        self.questionValue = qnEvent.content.question;
        self.targetUser = qnEvent.content.targetUser.participantNickname;

        console.log(`TargetUser: ${self.targetUser}`)
        console.log(`myNickname: ${self.myNickname}`)
        if(self.targetUser == self.myNickname) {
          self.isTargetUser = true;
          self.countdown.restart();
          self.countdown.begin();
        }else {
          self.isTargetUser = false;
          self.countdown.restart();
        }

      }
      else if(data.event && data.event == 'participantConnected' )  {
        const joinedUsername= data.content.nickname;
        if(!self.users.some(u => u.nickname == joinedUsername)) {
          self.users.push({nickname: joinedUsername});
        }
      } else if(data.event && data.event == 'questionAnswered' && data.content.questionValue == self.questionValue  )  {
        if(data.content.isCorrect) {
          self.messageService.add({
            severity: 'success',
            summary: "Correct",
            life: 1000
          });
        }
        else if(data.content.nickname == self.myNickname) {
          self.answer = `Boom! You're out.`
          self.messageService.add({
            severity: 'error',
            summary: 'Incorrect',
            detail: "Boom! You're out",
            life: 1000
          });
        } else {
          self.answer = `Boom! ${data.content.nickname} is out.`
          self.messageService.add({
            severity: 'error',
            summary: 'Incorrect',
            detail: `Boom! ${data.content.nickname} is out.`,
            life: 1000
          });
        }
      }
      else if(data.event && data.event == 'gameWon') {
        self.isGameWon = true;
        self.infoMsg = `Game Over! ${data.content.winnerNickname} has won the game!`
        self.messageService.add({
          severity: 'success',
          summary: 'Game Over',
          detail: `Game Over! ${data.content.winnerNickname} has won the game!`,
          life: 5000
        });
      }
    },
    e => {
      this.errorMsg = e.message;
    })
  }

  ngOnInit(): void {
    console.log('Getting sessionId');
    const self = this;

    self.isLoading = true;
    this.fbbService.getGameSessionParticipants(this.sessionId).subscribe({
      next: p => {
        console.log(p);
        for(let i = 0; i < p.length; i++) {

          if(!self.users.some(u => u.nickname == p[i].participantId)) {
            const u: IUserConnected = {
              nickname: p[i].participantId,
            }
            self.users.push(u);
          }
        }
        console.log('Users:', self.users);
        self.errorMsg = '';
        self.isLoading = false;
      },
      error: err => {
        self.errorMsg = err.message;
        self.isLoading = false;
      },
      complete: () => {}
    });

  }

  onPassClick() {
    const self = this;
    this.onHasAnswered();
    this.isWaiting = true;
    this.fbbService.answerQuestion(this.sessionId, this.questionValue, 'PASS')
      .subscribe(
        p => {
          console.log(p);
          self.isWaiting = false;
        },
        e => {
          self.messageService.add({
            severity: 'error',
            summary: 'Pass failed',
            detail: e.message,
            life: 5000
          });
          self.errorMsg = e.message;
          self.isWaiting = false;
        },
        () => {
        }
      );
  }

  onFizzClick() {
    this.onHasAnswered();
    const self = this;
    self.isWaiting = true;
    this.fbbService.answerQuestion(this.sessionId, this.questionValue, 'FIZZ')
      .subscribe(
        p => {
          console.log(p);
          self.isWaiting = false;
        },
        e => {
          self.messageService.add({
            severity: 'error',
            summary: 'Fizz failed',
            detail: e.message,
            life: 5000
          });
          self.errorMsg = e.message;
          self.isWaiting = false;
        },
        () => {
        }
      );
  }

  onBuzzClick() {
    this.onHasAnswered();
    const self = this;
    self.isWaiting = true;
    this.fbbService.answerQuestion(this.sessionId, this.questionValue, 'BUZZ')
      .subscribe(
        p => {
          self.isWaiting = false;
          console.log(p);
        },
        e => {
          self.messageService.add({
            severity: 'error',
            summary: 'Buzz failed',
            detail: e.message,
            life: 5000
          });
          self.errorMsg = e.message;
          self.isWaiting = false;
        },
        () => {
        }
      );
  }

  onFizzBuzzClick() {
    this.onHasAnswered();
    const self = this;
    this.fbbService.answerQuestion(this.sessionId, this.questionValue, 'FIZZBUZZ')
      .subscribe(
        p => {
          console.log(p);
        },
        e => {
          self.messageService.add({
            severity: 'error',
            summary: 'FizzBuzz failed',
            detail: e.message,
            life: 5000
          });
          self.errorMsg = e.message;
        },
        () => {
        }
      );
  }

  onHasAnswered() {
    this.hasAnswered = true;
    this.countdown?.stop();
  }

  onCountdownEvent(event?: any) {
    console.log('onCountdownEvent');
    console.log(event);
    const self = this;
    if(event.action == 'done' && self.isTargetUser && !self.hasAnswered) {
      console.log(`Boom, you're out`);

      this.fbbService.answerQuestion(this.sessionId, this.questionValue, 'TIMEOUT')
        .subscribe(
          p => {
            console.log(p);
          },
          e => {
            self.messageService.add({
              severity: 'error',
              summary: 'Timeout failed',
              detail: e.message,
              life: 5000
            });
            self.errorMsg = e.message;
          },
          () => {
          }
        );
    }
  }
}
