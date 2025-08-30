import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
// import * as Rj from 'rxjs';
import {environment} from '../../environments/environment';
import {Observable, Observer, Subject} from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import {map} from 'rxjs/operators';
import {fetchAuthSession} from "aws-amplify/auth";

export interface Message {
  source: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class FizzBuzzBoomWsockService {

  constructor() { }

  public subject: AnonymousSubject<MessageEvent> | undefined;
  public messages: Subject<Message> | undefined;

  public async connectWithToken(gameSessionToken: string, nickname: string) {
    const session = await fetchAuthSession();
    let jwt = session.tokens?.idToken?.toString();


    if(this.subject) {
      console.log('Subject exists', this.subject);
    }
    const url = `${environment.wsBaseUrl}?action=connect&session_id=${gameSessionToken}&nickname=${nickname}`;
    this.messages = <Subject<Message>>this.connect(url).pipe(
        map(
          (response: MessageEvent): Message => {
            console.log('Data:' + response.data);
            let data = JSON.parse(response.data);
            return data;
          }
        )
      );
  }

  private connect(url: string): AnonymousSubject<MessageEvent> {
    console.log(JSON.stringify(this.subject));
    if(this.subject) {
      this.subject.complete();
      this.subject.unsubscribe();
    }

    this.subject = this.create(url);
    console.log("Successfully connected: " + url);

    return this.subject;
  }


  private create(url: any): AnonymousSubject<MessageEvent> {
    // const jwt = ((session && session.idToken) ? (session.idToken.jwtToken) : null)
    console.log('Calling create with url:' + url);
    let wsc = new WebSocket(`${url}`);

    //TODO how to get this working?
    // wsc.onopen = (event: any) => {
    //   // Send a message with the API key in the header
    //   wsc.send(JSON.stringify({
    //     'type': 'connection',
    //     'headers': {
    //       'x-api-key': environment.xApiKey
    //     }
    //   }));
    // }

    const observable = new Observable((obs: Observer<MessageEvent>) => {
      wsc.onmessage = (event: MessageEvent) => obs.next(event);
      wsc.onerror = (event: Event) => {
         // Forward as a proper Error
        obs.error(new Error(`WebSocket error on ${url}`));
      };
      wsc.onclose = () => {
        // Complete the observable if the socket closes
        obs.complete();
      };
      // Cleanup
      return () => {
        if (wsc.readyState === WebSocket.OPEN || wsc.readyState === WebSocket.CONNECTING) {
          wsc.close();
        }
      };
    });
    const observer = {
      next: (data: Object) => {
        if (wsc.readyState === WebSocket.OPEN) {
          wsc.send(JSON.stringify(data));
        }
      },
      error: (err: any) => {
        console.error('Closing WebSocket due to observer error:', err);
        if (wsc.readyState === WebSocket.OPEN || wsc.readyState === WebSocket.CONNECTING) {
          wsc.close();
        }
      },
      complete: () => {
        if (wsc.readyState === WebSocket.OPEN) {
          wsc.close();
        }
      }
    };

    // @ts-ignore
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }
}
