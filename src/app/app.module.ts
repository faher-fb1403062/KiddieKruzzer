import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule} from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { ItemsComponent } from './components/items/items.component';
import { ItemService} from './services/item.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import {AuthService} from './auth.service';
import {BranchService} from './services/branch.service';
import {ItemTypeService} from './services/item-type.service';
import { OperatorsComponent } from './components/operators/operators.component';
import { BranchesComponent } from './components/branches/branches.component';
import { RentalsComponent } from './components/rentals/rentals.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { GlobalService } from './services/global.service';
import { ItemTypesComponent } from './components/item-types/item-types.component';
import { OperatorService } from './services/operator.service';

const appRoutes: Routes = [
  { path: 'items', component: ItemsComponent },
  { path: 'operators', component: OperatorsComponent },
  { path: 'branches', component: BranchesComponent },
  { path: 'itemTypes',      component: ItemTypesComponent },
  { path: 'rentals',      component: RentalsComponent },
  { path: 'login', component: LoginComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    NavbarComponent,
    LoginComponent,
    OperatorsComponent,
    BranchesComponent,
    RentalsComponent,
    InvoicesComponent,
    ItemTypesComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'kiddykruzzer'),
    AngularFirestoreModule,
    FormsModule,
    ModalModule.forRoot(),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  providers: [ItemService, AuthService, BranchService, ItemTypeService, GlobalService, OperatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
