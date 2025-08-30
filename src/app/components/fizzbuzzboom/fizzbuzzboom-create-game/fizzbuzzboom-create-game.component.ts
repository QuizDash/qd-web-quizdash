import {Component, OnInit, ViewChild} from '@angular/core';
import {FizzBuzzBoomService} from '../../../services/fizzbuzzboom.service';
import {MessageService} from 'primeng/api';
import {FizzBuzzBoomWsockService} from '../../../services/fizzbuzzboom-wsock.service';
import {IUserConnected} from '../../../models/events/user-connected.interface';
import {IQuestionPosted} from '../../../models/events/question-posted.interface';
import {FormsModule} from "@angular/forms";
import {MessagesModule} from "primeng/messages";
import {ListboxModule} from "primeng/listbox";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {SpinnerModule} from "primeng/spinner";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {NgIf} from "@angular/common";
import {AuthenticationService} from "../../../services/authentication.service";
import {ILogin} from "../../../models/login.interface";
import {CountdownComponent, CountdownConfig} from "ngx-countdown";
import {DialogModule} from "primeng/dialog";
import {CheckboxModule} from "primeng/checkbox";

@Component({
  selector: 'app-fizzbuzzboom-create-game',
  templateUrl: './fizzbuzzboom-create-game.component.html',
  standalone: true,
  imports: [FormsModule, ListboxModule, ConfirmDialogModule, ToastModule, ProgressSpinnerModule, NgIf, CountdownComponent, DialogModule, CheckboxModule],
  styleUrls: ['./fizzbuzzboom-create-game.component.scss']
})
export class FizzBuzzBoomCreateGameComponent implements OnInit {
  @ViewChild('cd', { static: false }) public countdown!: CountdownComponent;
  config: CountdownConfig = { leftTime: 10, demand: true };
  answer: string = '';
  errorMsg: string = '';
  infoMsg: string = '';
  isLoading = false;
  sessionId: string = '';
  users: IUserConnected[] = [];
  targetUser: string = '';
  login?: ILogin;
  isStarted = false;
  isGameWon = false;
  showSetSettingsDialog = false;
  fizzMultiple = 3;
  buzzMultiple = 5;
  isRandomQuestion= false;
  randomMaxValue = 100;
  timeLimitSeconds: number = 5;

  protected questionValue = 0;

  constructor(private fbbService: FizzBuzzBoomService,
              private authService: AuthenticationService,
              private wsService: FizzBuzzBoomWsockService,
              private messageService: MessageService)
  {
    this.authService = authService;
    authService.loginEvent.subscribe(
      user => this.onLoginChanged(user)
    );
  }

  ngOnInit(): void {
    this.initialise();

  }

  async initialise(): Promise<void> {
    this.isLoading = true;
    await this.authService.authenticate();
    this.newGame();
    this.isLoading = false;
  }

  newGame() {
    this.showSetSettingsDialog = true;
  }

  createGame(): void {
    this.showSetSettingsDialog = false;
    this.createSession();
  }

  onLoginChanged(login: ILogin): void {
    const self = this;
    console.log('Login changed', login);
    self.login = login;
  }

  createSession() {
    const self = this;
    console.log(`Fizz: ${this.fizzMultiple}, Buzz: ${this.buzzMultiple}, isRandom: ${this.isRandomQuestion},  Max: ${this.randomMaxValue}`);
    this.fbbService.createGameSession(this.fizzMultiple, this.buzzMultiple, this.isRandomQuestion, this.randomMaxValue, this.timeLimitSeconds)
      .subscribe(
        p => {
          console.log(p);
          self.sessionId = p.sessionId;
          self.countdown.left = self.timeLimitSeconds + 5;
          this.wsService.connectWithToken(this.sessionId, 'Host').then(x=> {
            this?.wsService?.subject?.subscribe(msg => {
              console.log(msg);
              const data = JSON.parse(msg.data);
              console.log(data);
              if(data.event && data.event == 'question') {
                const qnEvent: IQuestionPosted = data;
                self.questionValue = qnEvent.content.question;
                self.targetUser = qnEvent.content.targetUser.participantNickname;
                self.countdown.restart();
                self.countdown.begin();
              }
              else if(data.event && data.event == 'participantConnected' )  {
                self.users = [...this.users, data.content];
              } else if(data.event && data.event == 'questionAnswered' && data.content.questionValue == self.questionValue  )  {
                self.countdown.restart();
                if(data.content.isCorrect) {
                  self.answer = 'Correct'
                }
                else {
                  self.answer = `Boom! ${data.content.nickname} is out.`;
                  self.users = self.users.filter(a => a.nickname != data.content.nickname);
                }
                console.log('Clicking');
                this.onStartClick();
              }
              else if(data.event && data.event == 'gameWon') {
                self.isGameWon = true;
                self.countdown.restart();
                self.infoMsg = `Game Over! ${data.content.winnerNickname} has won the game!`
                self.messageService.add({
                  severity: 'success',
                  summary: 'Game Over',
                  detail: `Game Over! ${data.content.winnerNickname} has won the game!`,
                  life: 5000
                });
              }

            })
          });
          self.errorMsg = '';
          self.isLoading = false;
        },
        e => {
          self.messageService.add({
            severity: 'error',
            summary: 'Session creation failed',
            detail: e.message,
            life: 5000
          });
          self.errorMsg = e.message;
          self.isLoading = false;
        },
        () => {
        }
      );
  }

  onStartClick() {
    const self = this;
    self.countdown.restart();
    if(!this.isGameWon) {
      let newQuestionValue;
      if(this.isRandomQuestion) {
        newQuestionValue = Math.floor(Math.random() * this.randomMaxValue) + 1;
      }
      else {
        newQuestionValue = self.questionValue + 1;
      }
      this.isStarted = true;
      this.fbbService.postQuestion(self.sessionId, newQuestionValue)
        .subscribe(
          p => {
            console.log('Sent');
          },
          e => {
            self.messageService.add({
              severity: 'error',
              summary: 'Session creation failed',
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

  onCountdownEvent(event?: any) {
    console.log('onCountdownEvent');
    console.log(event);
    const self = this;

    if(event.action == 'done') {
      console.log(this.targetUser);
      if(this.targetUser || '' != '')  {
        this.fbbService.timeoutUser(this.sessionId, this.questionValue, this.targetUser)
          .subscribe({
              next: p => {
                console.log(p);
              },
              error: e => {
                self.messageService.add({
                  severity: 'error',
                  summary: 'Timeout failed',
                  detail: e.message,
                  life: 5000
                });
                self.errorMsg = e.message;
              },
              complete: () => {
              }
            }
          );
      }

    }
  }
}
