
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as fs from 'file-saver';
import { line1, line2, line3, rowKeys } from '../model/header';
import * as _ from 'lodash';
import * as Excel from 'exceljs';
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

   exportToExcel(pfAggData: any) {
    const workbook: Excel.Workbook = new Excel.Workbook();
    const worksheet: Excel.Worksheet = workbook.addWorksheet('Sales');
    this.setHeaders(worksheet);
    this.setTitles(worksheet);
    this.formatWorksheet(worksheet);
    this.downloadWorkbook(workbook);
  }

  setHeaders(worksheet: Excel.Worksheet) {
    this.addToHeader(line1, worksheet);
    this.addToHeader(line2, worksheet);
    this.addToHeader(line3, worksheet);
  }
  addToHeader(text: string, worksheet: Excel.Worksheet) {
    const headerRow: Excel.Row = worksheet.addRow(text);
    headerRow.font = { size: 20, bold: true };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  }

   setTitles(worksheet) {
    const titles: Excel.Row = worksheet.addRow(_.method(_.map(rowKeys, 'field'), 'toLowerCase'));
    titles.alignment = { horizontal: 'center' };
    titles.font = { bold: true };
    titles.eachCell((cell : Excel.Cell )=> {
      cell.style.fill.type = 'pattern';
    })
  }

   addDataHeaderAndValues(worksheet, datum) {
    const dataHeaders = _.map(rowKeys, 'header')

    const dataHeaderRow = worksheet.addRow(dataHeaders);
    dataHeaderRow.font = { bold: true };
    dataHeaderRow.alignment = { horizontal: 'center' };
    worksheet.addRows(datum);
  }

   downloadWorkbook(workbook) {
    workbook.xlsx.writeBuffer().then(datum => {
      const blob = new Blob([datum], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      fs.saveAs(blob, 'Report');
    });
  }

  formatWorksheet(worksheet) {
    worksheet.mergeCells('A1:D3');
  }
}
