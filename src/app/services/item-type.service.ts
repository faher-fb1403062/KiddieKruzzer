import { Injectable } from '@angular/core';
import { ItemType} from '../models/ItemType';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {Operator} from '../models/Operator';
import {AngularFireDatabase} from 'angularfire2/database';


@Injectable({
  providedIn: 'root'
})
export class ItemTypeService {
  itemTypesCollection: AngularFirestoreCollection<ItemType>;
  itemTypes: Observable<ItemType[]>;
  itemTypesDoc: AngularFirestoreDocument<ItemType>;
  db: AngularFireDatabase;

  constructor(public afs: AngularFirestore) {
    this.itemTypesCollection = this.afs.collection('iTypes');
    this.itemTypes = this.itemTypesCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as ItemType;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }));
  }
  getItemTypes() {
    return this.itemTypes;
  }
  addItemType(itemType: ItemType) {
    this.itemTypesCollection.add(itemType);
  }
  updateItemType(itemType: ItemType) {
    this.itemTypesDoc = this.afs.doc(`iTypes/${itemType.id}`);
    this.itemTypesDoc.update(itemType);
    console.log(itemType);
  }
  updateSelectedItemTypes(itemTypes: ItemType[]) {
    itemTypes.forEach((element) => {
      this.itemTypesDoc = this.afs.doc(`iTypes/${element.id}`);
      this.itemTypesDoc.update(element);
    });
  }
  deleteItemType(itemType: ItemType) {
    this.itemTypesDoc = this.afs.doc(`iTypes/${itemType.id}`);
    this.itemTypesDoc.delete();
  }
  deleteSelectedItemTypes(itemTypes: ItemType[]) {
    itemTypes.forEach((element) => {
      this.itemTypesDoc = this.afs.doc(`iTypes/${element.id}`);
      this.itemTypesDoc.delete();
    });
  }
  async getItemTypePromise(id: string) {
    const itemType = await this.afs.doc(`iTypes/${id}`)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
    return itemType;
  }
}
