import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Observable, } from 'rxjs';
import {map, take} from 'rxjs/operators';
import {Rental} from '../models/Rental';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  rentalsCollection: AngularFirestoreCollection<Rental>;
  rentals: Observable<Rental[]>;
  rentalsDoc: AngularFirestoreDocument<Rental>;
  constructor(public afs: AngularFirestore) {
    this.rentalsCollection = this.afs.collection('Rentals');
    this.rentals = this.rentalsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Rental;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }));
  }
  getRentals() {
    return this.rentals;
  }
 /* addRental(rental: Rental) {
    this.rentalsCollection.add(rental);
  }*/
  updateRental(rental: Rental) {
    this.rentalsDoc = this.afs.doc(`Rentals/${rental.id}`);
    this.rentalsDoc.update(rental);
    console.log(rental);
  }
  updateSelectedRentals(rentals: Rental[]) {
    rentals.forEach((element) => {
      this.rentalsDoc = this.afs.doc(`Rentals/${element.id}`);
      this.rentalsDoc.update(element);
    });
  }
  deleteRental(rental: Rental) {
    this.rentalsDoc = this.afs.doc(`Rentals/${rental.id}`);
    this.rentalsDoc.delete();
  }
  deleteSelectedRentals(rentals: Rental[]) {
    rentals.forEach((element) => {
      this.rentalsDoc = this.afs.doc(`Rentals/${element.id}`);
      this.rentalsDoc.delete();
    });
  }
  async getRentalPromise(id: string) {
     const rental = await this.afs.doc(`Rentals/${id}`)
       .valueChanges()
       .pipe(take(1))
       .toPromise();
     return rental;
  }

}



