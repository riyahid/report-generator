import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import * as _ from 'lodash';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { CarsComponent } from '../cars/cars.component';
import { Transaction } from '../model/transaction.model';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css']
})
export class TransactionsListComponent implements OnInit, AfterViewInit {
  @ViewChild('funds', { static: true }) table: ElementRef;

  @Input() sale: any;
  cols: any[];
  span = 'jj';

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
    });
    this.cols = [
      { field: 'invno', header: 'Inv No.', footer: 'Total' },
      { field: 'date', header: 'Date' },
      { field: 'hsn', header: 'HSN' },
      { field: 'particulars', header: 'Particulars' },
      { field: 'pairs', header: 'Pairs' },
      { field: 'rate', header: 'Rate' },
      { field: 'amount', header: 'Amount', footer: 'sum' },
      { field: 'cgst', header: 'CGST', footer: 'sum' },
      { field: 'sgst', header: 'SGST', footer: 'sum' },
      { field: 'igst', header: 'IGST', footer: 'sum' },
      { field: 'grandTotal', header: 'Grand Total', footer: 'sum' }
    ];
  }

  ngAfterViewInit() {
    Array.from(document.getElementsByClassName('2')).forEach((item: any) => (item.rowspan = 2));
    console.log(document.getElementsByClassName('2'));
  }

  exportTable() {
    this.transactionService.exportToExcel('funds');
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

  getTotalOfField(field: string) {
    return _.sum(_.map(this.transactions, field));
  }

  print() {
    this.dialog.open(CarsComponent, { data: [...this.transactions] });
  }

  exportExcel() {
    this.transactionService.exportToExcel('funds');
  }
  exportPdf() {
    const data = document.getElementById('funds');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }
  getrow(rowdata): number {
    return rowdata.assets.length;
  }
}
