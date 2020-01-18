import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Asset, Transaction } from '../model/transaction.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {
  constructor(
    private service: TransactionService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTransactionComponent>
  ) {}

  addForm: FormGroup;
  assets: FormArray;
  isIgst: boolean;

  ngOnInit() {
    this.addForm = this.fb.group({
      invno: [0, Validators.required],
      particulars: ['', Validators.required],
      hsn: [64, Validators.required],
      assets: this.fb.array([this.createAsset()]),
      cgst: 0,
      sgst: 0,
      igst: 0,
      grandTotal: 0,
      amount: 0,
      date: new Date()
    });

    this.addForm.get('assets').valueChanges.subscribe((value: Asset[]) => {
      this.updateTotals(value.map(element => element.pairs * element.rate));
    });
  }

  updateTotals(assets: number[] = []) {
    const total: number = _.sum(assets);
    const tax: number = total * 0.05;
    this.addForm.get('amount').setValue(total);
    this.addForm.get('grandTotal').setValue(total + tax);
    if (this.isIgst) {
      this.addForm.get('igst').setValue(tax);
    } else {
      this.addForm.get('cgst').setValue(tax / 2);
      this.addForm.get('sgst').setValue(tax / 2);
    }
  }

  createAsset(): any {
    return this.fb.group({
      pairs: 0,
      rate: 0
    });
  }

  addAsset(): void {
    this.assets = this.addForm.get('assets') as FormArray;
    this.assets.push(this.createAsset());
  }

  onSubmit(formValue: Transaction) {
    this.dialogRef.close({ ...formValue });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
