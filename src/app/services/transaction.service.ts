import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private firestore: AngularFirestore) { }

  getTransactions() {
    return this.firestore.collection('transactions').snapshotChanges();
  }
}
