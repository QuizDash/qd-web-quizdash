import {Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ILogin} from "../../../models/login.interface";
import {AuthenticationService} from "../../../services/authentication.service";
import {BaseComponent} from "../../base.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends BaseComponent {

  isLoading = false;
  login: ILogin | undefined;
  userId: string = ''
  nickname: string = '';

  constructor(private ref: ChangeDetectorRef,
              authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) {
    super(authenticationService);
    const self = this;
    this.authenticationService.loginEvent.subscribe(
      user => this.onLoginChanged(user)
    );
    self.nickname = localStorage.getItem("nickname") || '';
  }

  ngOnInit(): void {
    this.initialise();
  }

  onLoginChanged(login: ILogin): void {
    const self = this;
    // console.log('Login changed', login);
    self.login = login;
    self.userId = login.nickname;
  }

  async initialise(): Promise<void> {
    this.isLoading = true;
    await this.authenticationService.authenticate();
    this.isLoading = false;
  }

  isLoggedIn() {
    return (this.login?.nickname != 'undefined');
  }

}
