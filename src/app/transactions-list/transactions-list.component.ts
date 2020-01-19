import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import * as _ from 'lodash';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { allYears, line3, month } from '../model/header';
import { Transaction } from '../model/transaction.model';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css']
})
export class TransactionsListComponent implements OnInit {
  @ViewChild('funds', { static: true }) table: ElementRef;

  @Input() sale: any;
  cols: any[];
  span = 'jj';

  line1 = 'UMA SHOE FACTORY';
  line2 = 'B-24, ALOK NAGAR, JAIPUR HOUSE, AGRA';
  line3 = ' statement for the month ';
  months = month;
  years = allYears;
  selMonth: string;
  selYear: number;

  constructor(
    private transactionService: TransactionService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  transactions: Transaction[] = [];
  filtered: Transaction[] = [];
  dataSource = new MatTableDataSource<Transaction>([]);

  displayedColumns: string[] = ['id', 'type', 'assets'];

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.transactions.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }

  ngOnInit() {
    this.sale = this.sale === 'true' ? true : false;
    this.line3 = this.sale ? 'Sale statement for the month ' : 'Purchase statement for the month ';
    this.transactionService.getTransactions().subscribe(data => {
      this.transactions = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as any)
        } as Transaction;
      });
      this.transactions = _.sortBy(this.transactions, 'invno');
      if (this.sale) {
        this.filtered = this.transactions.filter(element => element.type === 'Sale');
      } else {
        this.filtered = this.transactions.filter(element => element.type === 'Purchase');
      }
    });
    const items: NodeListOf<HTMLElement> = document.getElementsByName('custom');
    items.forEach((item: any) => (item.rowspan = 2));
    this.cd.detectChanges();

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

  onChange(event) {
    this.filterTransactions({month: this.selMonth, year: this.selYear})
  }

  filterTransactions(value: any) {
    const mont = _.map(this.months, 'label')[Number(value.month) - 1];
    this.line3 = `${line3} ${mont} ${value.year}`;
    const format = `${value.month}\/${value.year}`;
    this.filtered = this.transactions.filter(e => {
      return typeof(e.date) === 'string' ? e.date.includes(format): false;
    });
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
    return _.sum(_.map(this.filtered, field));
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
}
