import {Component, OnInit, OnDestroy, HostBinding, Input, Output, EventEmitter} from '@angular/core';
import {NgForm} from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import {GlobalService} from '../../services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  username: string;
  password: string;
  errMsg: string = null;
  isLoggedIn = false;
  constructor(private authService: AuthService, private router: Router, private globalService: GlobalService) {
  }
  ngOnInit() {
    this.isLoggedIn = this.globalService.getIsLoggedIn();
  }
  async onSubmit(form: NgForm ) {
    let err = null;
    if (form.value.username === '') {
      err = 'Please Enter Username';
    } else if (form.value.password === '') {
      err = 'Please Enter Password';
    } else {
      this.username = form.value.username + '@kiddiekruzzer.qa';
      this.password = form.value.password;
      await this.authService.login(this.username, this.password);
      await this.delay(1000); // wait till the login is complete
      if (this.globalService.getErrMsg() !== null) {
        err = this.globalService.getErrMsg();
      }
    }
    await this.showFailureAlert(err);
  }
  async showFailureAlert(error: string) {
      this.errMsg = error;
      await this.delay(3000); // showing the error for a speciific time
      this.errMsg = null;
    }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  signout() {
    this.authService.logout();
    this.isLoggedIn = false;
  }

}
