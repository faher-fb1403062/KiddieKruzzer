import { Injectable } from '@angular/core';
import { Operator } from '../models/Operator';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Observable, } from 'rxjs';
import { map } from 'rxjs/operators';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {
  operatorsCollection: AngularFirestoreCollection<Operator>;
  operators: Observable<Operator[]>;
  operatorsDoc: AngularFirestoreDocument<Operator>;
  db: AngularFireDatabase;

  constructor(public afs: AngularFirestore) {
    this.operatorsCollection = this.afs.collection('Operators');
    this.operators = this.operatorsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Operator;
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    }));
  }
  getOperators() {
    return this.operators;
  }
  addOperator(operator: Operator) {
    this.operatorsCollection.add(operator);
  }
  updateOperator(operator: Operator) {
    this.operatorsDoc = this.afs.doc(`Operators/${operator.id}`);
    this.operatorsDoc.update(operator);
    console.log(operator);
  }
  updateSelectedOperators(operators: Operator[]) {
    operators.forEach((element) => {
      this.operatorsDoc = this.afs.doc(`Operators/${element.id}`);
      this.operatorsDoc.update(element);
    });
  }
  deleteOperator(operator: Operator) {
    this.operatorsDoc = this.afs.doc(`Operators/${operator.id}`);
    this.operatorsDoc.delete();
  }
  deleteSelectedOperators(operators: Operator[]) {
    operators.forEach((element) => {
      this.operatorsDoc = this.afs.doc(`Operators/${element.id}`);
      this.operatorsDoc.delete();
    });
  }
  getRental(id: string) {
    this.db.object(`Operators/${id}`).valueChanges();
  }
}
