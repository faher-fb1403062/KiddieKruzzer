import { Injectable } from '@angular/core';
import { Branch} from '../models/Branch';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {Item} from '../models/Item';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  branchesCollection: AngularFirestoreCollection<Branch>;
  branches: Observable<Branch[]>;
  branchesDoc: AngularFirestoreDocument<Branch>;

  constructor(public afs: AngularFirestore) {
    this.branchesCollection = this.afs.collection('branches');
    this.branches = this.branchesCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Branch;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }));
  }
  getBranches() {
    return this.branches;
  }
  addBranch(branch: Branch) {
    this.branchesCollection.add(branch);
  }
  updateBranch(branch: Branch) {
    this.branchesDoc = this.afs.doc(`branches/${branch.id}`);
    this.branchesDoc.update(branch);
    console.log(branch);
  }
  updateSelectedBranches(branches: Branch[]) {
    branches.forEach((element) => {
      this.branchesDoc = this.afs.doc(`branches/${element.id}`);
      this.branchesDoc.update(element);
    });
  }
  deleteBranch(branch: Branch) {
    this.branchesDoc = this.afs.doc(`branches/${branch.id}`);
    this.branchesDoc.delete();
  }
  deleteSelectedBranches(branches: Branch[]) {
    branches.forEach((element) => {
      this.branchesDoc = this.afs.doc(`branches/${element.id}`);
      this.branchesDoc.delete();
    });
  }
}
