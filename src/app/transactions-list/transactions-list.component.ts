import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '../model/transaction.model';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css']
})
export class TransactionsListComponent implements OnInit {

  constructor(private transactionService: TransactionService) { }

  transactions: Transaction[];

  ngOnInit() {
    this.transactionService.getTransactions().subscribe(data => {
      this.transactions = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Transaction;
      });
    });
  }

}
