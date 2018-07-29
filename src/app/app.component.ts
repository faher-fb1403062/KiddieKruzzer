import {Component, OnInit, Input} from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  isUserVerified = false;
  constructor(private authService: AuthService, private router: Router) {
  }
  hideNav(event) {
    this.isUserVerified = event;
  }
  ngOnInit() {
    this.authService.checkLogin().subscribe(loggedIn => {
      if (loggedIn) {
        this.isUserVerified = true;
        /*
        ToDo: Implement functionality if user logged in.
        ToDo 2: Create a global variable indication auth status.
         */
          this.router.navigateByUrl('items');
      } else {
        this.isUserVerified = false ;
        /*
        ToDo: Implement functionality if user is not logged in.
         */
        this.router.navigateByUrl('login');
      }
    });
  }
}
