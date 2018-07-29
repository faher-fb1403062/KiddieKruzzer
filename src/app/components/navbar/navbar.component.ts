import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() signoutEVNT: EventEmitter<any> = new EventEmitter();
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  signout() {
    this.authService.logout();
    this.signoutEVNT.emit(false); // output to the main app to hide the nav bar when user is logged out
  }
}
