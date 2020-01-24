import { Injectable } from '@angular/core';
import * as fs from 'file-saver';
import { line1, line2, line3, rowKeys, colWidths } from '../model/header';
import * as _ from 'lodash';
import * as Excel from 'exceljs';
import { Transaction } from '../model/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  exportToExcel(data: any, sheetName: string) {
    const workbook: Excel.Workbook = new Excel.Workbook();
    const worksheet: Excel.Worksheet = workbook.addWorksheet(sheetName);
    this.setHeaders(worksheet);
    this.setTitles(worksheet);
    this.addData(worksheet, data);
    this.formatWorksheet(worksheet);
    this.downloadWorkbook(workbook);
  }

  addData(worksheet: Excel.Worksheet, data: Transaction[]) {
    data.forEach(trans => {
      const pairs: string = _.join(_.map(trans.assets, 'pairs'), '\n');
      const rates: string = _.join(_.map(trans.assets, 'rate'), '\n');
      const row = [
        trans.invno,
        trans.date,
        trans.hsn,
        trans.particulars,
        pairs,
        rates,
        trans.amount,
        trans.cgst,
        trans.sgst,
        trans.igst,
        trans.grandTotal
      ];
      const sheetRow: Excel.Row = worksheet.addRow(row);
      this.formatRow(sheetRow);
    });
    this.addTotalRow(data, worksheet);
  }
  addTotalRow(data: Transaction[], worksheet: Excel.Worksheet) {
    const totalRow = [
      'Total',
      ,
      ,
      ,
      ,
      ,
      _.sum(_.map(data, 'amount')),
      _.sum(_.map(data, 'cgst')),
      _.sum(_.map(data, 'sgst')),
      _.sum(_.map(data, 'igst')),
      _.sum(_.map(data, 'grandTotal'))
    ];
    const sheetTotal: Excel.Row = worksheet.addRow(totalRow);
    this.formatRow(sheetTotal, true);
  }

  formatRow(row: Excel.Row, isTotal = false) {
    row.font = { size: 10, bold: isTotal };
    row.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    row.eachCell((cell, index) => {
      if (index > 6) {
        cell.style.alignment = { horizontal: 'right',vertical: 'middle' };
      }
    });
  }

  setHeaders(worksheet: Excel.Worksheet) {
    this.addToHeader(worksheet);
  }
  addToHeader(worksheet: Excel.Worksheet) {
    const text = `${line1}\n${line2}\n${line3}`;
    const headerRow: Excel.Row = worksheet.addRow([text]);
    headerRow.font = { size: 14, bold: true };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  }

  setTitles(worksheet: Excel.Worksheet) {
    const titles: Excel.Row = worksheet.addRow(_.map(rowKeys, 'header'));
    titles.alignment = { horizontal: 'center' };
    titles.font = { size: 10, bold: true };
  }

  addDataHeaderAndValues(worksheet, datum) {
    const dataHeaders = _.map(rowKeys, 'header');
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

  formatWorksheet(worksheet: Excel.Worksheet) {
    worksheet.mergeCells('A1:K1');
    worksheet.model.pageSetup.paperSize = Excel.PaperSize.A4;
    worksheet.model.pageSetup.fitToPage = true;
    worksheet.columns.forEach((col, index) => {
      col.width = colWidths[index];
      if (index > 5) {
        col.style.alignment = { horizontal: 'right' };
      }
    });
  }
}
