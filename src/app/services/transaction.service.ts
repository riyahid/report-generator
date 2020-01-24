import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private firestore: AngularFirestore) {}

  getTransactions(): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('transactions').snapshotChanges();
  }

  addTransactions(data: any) {
    return this.firestore.collection('transactions').add(data);
  }

  deleteTransactions(path: string) {
    return this.firestore.collection('transactions').doc(path).delete();
  }
}
