import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FizzBuzzBoomService} from "../../../services/fizzbuzzboom.service";
import {FizzBuzzBoomWsockService} from "../../../services/fizzbuzzboom-wsock.service";
import {MessageService} from "primeng/api";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-fizzbuzzboom-load-test',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  templateUrl: './fizzbuzzboom-load-test.component.html',
  styleUrl: './fizzbuzzboom-load-test.component.scss'
})
export class FizzbuzzboomLoadTestComponent {

  answer: string = '';
  errorMsg: string = '';
  infoMsg: string = '';
  isLoading = false;
  isWaiting = false;
  userCount=10;
  delayMs=0;

  sessionId: string = '';
  session: any;

  constructor(private route: ActivatedRoute,
              private fbbService: FizzBuzzBoomService,
              private wsService: FizzBuzzBoomWsockService,
              private messageService: MessageService) {

  }

  async onSessionEntered() {
    const self = this;
    console.log('onSessionEntered()')
    this.sessionId = this.sessionId.trim().toUpperCase();
    self.errorMsg = '';

    self.isWaiting = true;

    this.fbbService.getGameSession(this.sessionId)
      .subscribe({
        next: s => {
          console.log(s);
          self.isWaiting = false;
          this.session = s;
          self.addUsers();
        },
        error: err => {
          self.errorMsg = 'Invalid session token entered, please try again.'
          self.isWaiting = false
        },
        complete: () => {}
      });
  }

  async addUsers() {
    const self = this;
    for(let i = 0; i < this.userCount; i++){
      const nickname = `test-${i+1}`;

      self.fbbService.reserveSessionNickname(this.sessionId, nickname)
        .subscribe({
          next: async s => {
            await self.wsService.connectWithToken(this.sessionId, nickname);
          },
          error: err => {
            console.log(err.message);
          },
          complete: () => {}
        })
        await self.sleep(self.delayMs);
    }
  }

  sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
