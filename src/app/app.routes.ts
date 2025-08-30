import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ArithmeticQuizComponent} from './components/arithmetic-quiz/arithmetic-quiz.component';
import {LogoutComponent} from './components/logout/logout.component';
import {LoginComponent} from './components/login/login.component';
import {authGuard} from './guards/auth.guard';
import {AboutComponent} from './components/about/about.component';
import {LandingComponent} from './components/landing/landing.component';
import {FizzbuzzboomLandingComponent} from './components/fizzbuzzboom/fizzbuzzboom-landing/fizzbuzzboom-landing.component';
import {
  FizzBuzzBoomCreateGameComponent
} from './components/fizzbuzzboom/fizzbuzzboom-create-game/fizzbuzzboom-create-game.component';
import {
  FizzBuzzBoomJoinedGameComponent
} from './components/fizzbuzzboom/fizzbuzzboom-joined-game/fizzbuzzboom-joined-game.component';

export const routes: Routes = [
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'arithmeticquiz',
    component: ArithmeticQuizComponent
  },
  {
    path: 'fizzbuzzboom/landing',
    component: FizzbuzzboomLandingComponent
  },
  {
    path: 'fizzbuzzboom/new-game',
    component: FizzBuzzBoomCreateGameComponent, canActivate: [authGuard]
  },
  {
    path: 'fizzbuzzboom/join-game/:sessionId/:nickname',
    component: FizzBuzzBoomJoinedGameComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent, canActivate: [authGuard]
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  }

];
