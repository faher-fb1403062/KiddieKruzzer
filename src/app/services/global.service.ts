import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  errMsg: string = null;
  isLoggedIn = false;
  constructor() { }
  getErrMsg () {
    return this.errMsg;
  }
  setErrMsg(msg: string) {
    this.errMsg = msg;
  }
  setIsLoggedIn( value: boolean ) {
    this.isLoggedIn = value;
  }
  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }
}
