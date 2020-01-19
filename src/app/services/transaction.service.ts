import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

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

  exportToExcel(tableId: string, name?: string) {
    const timeSpan = new Date().toISOString();
    const prefix = name || 'Report';
    const fileName = `${prefix}-${timeSpan}`;
    const targetTableElm = document.getElementById(tableId);
    const wb = XLSX.utils.table_to_book(targetTableElm, {
      sheet: prefix,
      raw: true
    } as XLSX.Table2SheetOpts);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}
