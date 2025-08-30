import { Component } from '@angular/core';
import {AmplifyAuthenticatorModule} from "@aws-amplify/ui-angular";
import {CommonModule} from "@angular/common";
import {Router, RouterOutlet} from "@angular/router";
import { signIn, type SignInInput } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, AmplifyAuthenticatorModule, FormsModule],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  signUpState: any;

  constructor(private router: Router) {

  }

  ngOnInit(): void {
    Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          console.log('user have been signedIn successfully.');
          this.router.navigateByUrl("/");
          break;
        case 'signedOut':
          console.log('user have been signedOut successfully.');
          break;
        case 'tokenRefresh':
          console.log('auth tokens have been refreshed.');
          break;
        case 'tokenRefresh_failure':
          console.log('failure while refreshing auth tokens.');
          break;
        case 'signInWithRedirect':
          console.log('signInWithRedirect API has successfully been resolved.');
          break;
        case 'signInWithRedirect_failure':
          console.log('failure while trying to resolve signInWithRedirect API.');
          break;
        case 'customOAuthState':
          console.log('custom state returned from CognitoHosted UI');
          break;
      }
    });
  }

  /*
  old() {

    const formFields = {
      signUp: {
        email: {
          labelHidden: true,
          label: "Email",
          order: 1
        },
        given_name: {
          order: 2,
          placeholder: "Firstname"
        },
        family_name: {
          order: 4,
          placeholder: "Surname"
        },
        nickname: {
          placeholder: 'Nickname (how others will see you, 5-12 chars)',
          isRequired: true,
          hint: 'how others will see you',
          order: 5
        },
        password: {
          order: 6
        },
        confirm_password: {
          order: 7
        }
      },
      signIn: {
        username: {
          labelHidden: false,
          placeholder: 'Enter Your Email Here',
          isRequired: true,
          label: 'Email:'
        },
      }
    }
  }*/


}
