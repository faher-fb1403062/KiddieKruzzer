import { Injectable } from '@angular/core';
import { AngularFireAuth} from 'angularfire2/auth';
import { Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import {GlobalService} from './services/global.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth, private globalService: GlobalService) {
    this.user = firebaseAuth.authState;
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        for (let attribute in value) {
          console.log(attribute);
        }
        console.log(`Res: ${JSON.stringify(value)}`);
        this.globalService.setIsLoggedIn(true);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
        this.globalService.setErrMsg(err.message);
      });
  }
  checkLogin(): Observable<boolean> {
    return this.firebaseAuth.authState.pipe(
      map(auth => {
        if (auth !== null) {
          return true;
        }
        return false;
      })
    );
  }


  logout() {
    this.firebaseAuth
      .auth
      .signOut();
    this.globalService.setIsLoggedIn( false );
  }
}
