import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FizzBuzzBoomWsockService} from '../../../services/fizzbuzzboom-wsock.service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {ListboxModule} from "primeng/listbox";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {NgIf} from "@angular/common";
import {MessagesModule} from "primeng/messages";
import {ILogin} from "../../../models/login.interface";
import {AuthenticationService} from "../../../services/authentication.service";
import {DialogModule} from "primeng/dialog";
import {FizzBuzzBoomService} from "../../../services/fizzbuzzboom.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-fizzbuzzboom-landing',
  templateUrl: './fizzbuzzboom-landing.component.html',
  standalone: true,
  imports: [FormsModule, ListboxModule, ConfirmDialogModule, ToastModule, MessagesModule, ProgressSpinnerModule, NgIf,
    RouterLink, DialogModule],
  styleUrls: ['./fizzbuzzboom-landing.component.scss']
})
export class FizzbuzzboomLandingComponent implements OnInit {

  isLoading = false;
  isWaiting = false;
  showCreateNicknameDialog = false;
  authService: AuthenticationService;

  nickname: string = '';
  sessionId: string = '';
  session: any;
  login?: ILogin;

  errorMsg = '';

  constructor(private wsService: FizzBuzzBoomWsockService, private fbbService: FizzBuzzBoomService,
              private router: Router,
              private ref: ChangeDetectorRef,
              authService: AuthenticationService,
              private messageService: MessageService) {
    this.authService = authService;
    authService.loginEvent.subscribe(
      user => this.onLoginChanged(user)
    );
  }

  ngOnInit(): void {
    this.initialise()
  }

  onLoginChanged(login: ILogin): void {
    const self = this;
    self.login = login;
  }

  async initialise(): Promise<void> {
    const self = this;
    await this.authService.authenticate();

  }

  onSessionEntered() {
    const self = this;
    console.log('onSessionEntered()')
    this.sessionId = this.sessionId.trim().toUpperCase();
    self.errorMsg = '';

    self.isWaiting = true;

    this.fbbService.getGameSession(this.sessionId)
      .subscribe({
        next: s => {
          // console.log(s);
          self.isWaiting = false;
          this.session = s;
          this.showCreateNicknameDialog = true;
        },
        error: err => {
          self.errorMsg = 'Invalid session token entered, please try again.'
          self.isWaiting = false
        },
        complete: () => {}
      });
  }

  async joinGame() {
    const self = this;

    self.isWaiting = true

    this.fbbService.reserveSessionNickname(this.sessionId, this.nickname)
      .subscribe({
        next: async s => {
          await self.wsService.connectWithToken(this.sessionId, this.nickname);

          self.wsService.messages?.subscribe({
            next: (msg) => {
              localStorage.setItem('nickname', this.nickname);
              this.router.navigate(['fizzbuzzboom/join-game', this.sessionId, this.nickname], {
                queryParams: {
                  fizzMultiple: self.session.fizzMultiple,
                  buzzMultiple: self.session.buzzMultiple,
                  isRandomQuestion: self.session.isRandomQuestion,
                  maxRandomValue: self.session.maxRandomValue
                }
              });
              self.isWaiting = false
            },
            error: (err) => {
              // 👈 Will be triggered if WebSocket fails
              console.error('WebSocket connection failed:', err.message);
              self.isWaiting = false
              alert('Connection error. The entered username may either be taken or is not allowed. Please try again.');
            },
            complete: () => {
              console.log('WebSocket closed');
            }
          });
        },
        error: err => {
          console.log(err.message);
          self.isWaiting = false
          self.messageService.add({
            severity: 'error',
            summary: 'Invalid nickname',
            detail: err.message,
            life: 3000
          });
          this.nickname = '';
          // self.errorMsg = 'Invalid nickname, please choose another.'
        },
        complete: () => {}
      })
  }

  isLoggedIn() {
    return (this.login?.nickname != 'undefined');
  }
}
