import {Component, NgZone, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  standalone: true,
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private ngZone: NgZone) { }

  ngOnInit(): void {
    console.log('Signing out...');
    this.logout();
  }

  async logout(): Promise<any> {
    await this.authenticationService.logout();
    this.ngZone.run(() => {
      this.router.navigate(['/login']);
    });
  }

}
