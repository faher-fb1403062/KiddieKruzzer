import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Item} from '../models/Item';
import { Observable, Subscription } from 'rxjs';
import {map, take} from 'rxjs/operators';
import {AngularFireDatabase} from 'angularfire2/database';


@Injectable({
  providedIn: 'root'
})
export class ItemService {
  itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  itemDoc: AngularFirestoreDocument<Item>;
  db: AngularFireDatabase;

  constructor(public afs: AngularFirestore) {
    //this.items = this.afs.collection('items').valueChanges();
    this.itemsCollection = this.afs.collection('items');
    this.items = this.itemsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }));
  }
  getItems() {
    return this.items;
  }
  addItem(item: Item) {
    this.itemsCollection.add(item);
  }
  updateItem(item: Item) {
    this.itemDoc = this.afs.doc(`items/${item.id}`);
    this.itemDoc.update(item);
    console.log(item);
  }
  updateSelectedItems(items: Item[]) {
    items.forEach((element) => {
      this.itemDoc = this.afs.doc(`items/${element.id}`);
      this.itemDoc.update(element);
    });
  }
  deleteItem(item: Item) {
    this.itemDoc = this.afs.doc(`items/${item.id}`);
    this.itemDoc.delete();
  }
  deleteSelectedItems(items: Item[]) {
      items.forEach((element) => {
      this.itemDoc = this.afs.doc(`items/${element.id}`);
      this.itemDoc.delete();
    });
    }
  async getItemPromise(id: string) {
    const item = await this.afs.doc(`items/${id}`)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
    return item;
  }
  }



