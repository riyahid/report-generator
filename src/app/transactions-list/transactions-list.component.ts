import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '../model/transaction.model';
import * as _ from 'lodash';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css']
})
export class TransactionsListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input() sale: any;

  constructor(private transactionService: TransactionService, private dialog: MatDialog) {}

  transactions: Transaction[] = [];
  dataSource = new MatTableDataSource<Transaction>([]);

  displayedColumns: string[] = ['id', 'type', 'assets'];

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.transactions.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }

  ngOnInit() {
    this.sale = this.sale === 'true' ? true : false;
    this.transactionService.getTransactions().subscribe(data => {
      this.transactions = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as any)
        } as Transaction;
      });
      if (this.sale) {
        this.transactions = this.transactions.filter(element => element.type === 'Sale');
      } else {
        this.transactions = this.transactions.filter(element => element.type === 'Purchase');
      }
      this.dataSource = new MatTableDataSource<Transaction>(this.transactions);
      this.dataSource.sort = this.sort;
    });
  }

  exportTable() {
    this.transactionService.exportToExcel('ExampleTable');
  }

  addTransaction() {
    this.dialog
      .open(AddTransactionComponent, { data: this.sale })
      .afterClosed()
      .subscribe(data => {
        if (data) {
          this.transactionService.addTransactions(data);
        }
      });
  }
}
