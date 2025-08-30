import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from './base.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FizzBuzzBoomService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  public createGameSession(fizzMultiple: number, buzzMultiple: number, isRandom: boolean, maxRandomValue: number,
                           timeLimitSeconds: number):
      Observable<any> {
    console.log(`Creating game`);
    const body = {
      fizzMultiple: fizzMultiple,
      buzzMultiple: buzzMultiple,
      isRandom: isRandom,
      maxRandomValue: maxRandomValue,
      timeLimitSeconds: timeLimitSeconds,
    };
    const url = `${environment.apiBaseUrl}/fizzbuzzboom/v1/sessions`;

    console.log('Calling POST on url:' + url);
    console.log(JSON.stringify(body));
    const result$ = this.http
      .post(url, body)
      .pipe(catchError(this.handleError));
    return result$;
  }

  public getGameSession(sessionsId: string): Observable<any> {
    console.log(`Getting session`);

    const url = `${environment.apiBaseUrl}/fizzbuzzboom/v1/sessions/${sessionsId}`;

    console.log('Calling GET on url:' + url);
    const result$ = this.http
      .get(url)
      .pipe(catchError(this.handleError));
    return result$;
  }

  public getGameSessionParticipants(sessionsId: string): Observable<any> {
    console.log(`Getting session`);

    const url = `${environment.apiBaseUrl}/fizzbuzzboom/v1/sessions/${sessionsId}/participants`;

    console.log('Calling GET on url:' + url);
    const result$ = this.http
      .get(url)
      .pipe(catchError(this.handleError));
    return result$;
  }

  public postQuestion(sessionId: string, questionValue: number): Observable<any> {
    console.log(`Posting question`);
    const url = `${environment.apiBaseUrl}/fizzbuzzboom/v1/sessions/${sessionId}/questions`;

    const body = {
      sessionId: sessionId,
      questionValue: questionValue
    };

    console.log('Calling POST on url:' + url);
    console.log(JSON.stringify(body));
    const result$ = this.http
      .post(url, body)
      .pipe(catchError(this.handleError));
    return result$;
  }

  public reserveSessionNickname(sessionId: string, nickname: string): Observable<any> {
    console.log(`Reserving nickname`);
    const url = `${environment.apiBaseUrl}/fizzbuzzboom/v1/sessions/${sessionId}/participants`;

    const body = {
      sessionId: sessionId,
      nickname: nickname
    };

    console.log('Calling POST on url:' + url);
    console.log(JSON.stringify(body));
    const result$ = this.http
      .post(url, body)
      .pipe(catchError(this.handleError));
    return result$;
  }

  /**
   * answerQuestion
   * @param sessionId
   * @param questionValue
   * @param answer
   */
  public answerQuestion(sessionId: string, questionValue: number,
                        answer: 'FIZZ'|'BUZZ'|'FIZZBUZZ'|'PASS'|'TIMEOUT'): Observable<any> {
    console.log(`Posting question`);
    const url = `${environment.apiBaseUrl}/fizzbuzzboom/v1/answers`;
    const nickname = localStorage.getItem('nickname');

    const body = {
      sessionId: sessionId,
      questionValue: questionValue,
      nickname: nickname,
      answer: answer
    };

    console.log('Calling POST on url:' + url);
    console.log(JSON.stringify(body));
    const result$ = this.http
      .post(url, body)
      .pipe(catchError(this.handleError));
    return result$;
  }

  /**
   * answerQuestion
   * @param sessionId
   * @param questionValue
   * @param nickname
   * @param answer
   */
  public timeoutUser(sessionId: string, questionValue: number, nickname: string): Observable<any> {
    console.log(`Posting question`);
    const url = `${environment.apiBaseUrl}/fizzbuzzboom/v1/answers`;

    const body = {
      sessionId: sessionId,
      questionValue: questionValue,
      nickname: nickname,
      answer: 'TIMEOUT'
    };

    console.log('Calling POST on url:' + url);
    console.log(JSON.stringify(body));
    const result$ = this.http
      .post(url, body)
      .pipe(catchError(this.handleError));
    return result$;
  }

}
