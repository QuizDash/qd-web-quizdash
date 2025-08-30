import { Component } from '@angular/core';
import {NavbarComponent} from "./components/template/navbar/navbar.component";
import {RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    NavbarComponent,
    RouterOutlet
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'QuizDash';
}
