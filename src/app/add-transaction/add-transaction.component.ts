import { Component, OnInit, Inject } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Asset, Transaction } from '../model/transaction.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTransactionComponent>
  ) {}

  addForm: FormGroup;
  assets: FormArray;

  ngOnInit() {
    this.addForm = this.fb.group({
      invno: [null, Validators.required],
      particulars: ['', Validators.required],
      hsn: [64, Validators.required],
      assets: this.fb.array([this.createAsset()]),
      cgst: null,
      sgst: null,
      igst: null,
      grandTotal: null,
      amount: null,
      date: new Date(),
      isIgst: false,
      type: Boolean(this.data) ? 'Sale' : 'Purchase'
    });

    this.addForm.get('assets').valueChanges.subscribe((value: Asset[]) => {
      this.updateTotals(value.map(element => element.pairs * element.rate));
    });

    this.addForm.get('isIgst').valueChanges.subscribe(() => {
      const assets: Asset[] = this.addForm.get('assets').value;
      this.updateTotals(assets.map(element => element.pairs * element.rate));
    });
  }

  updateTotals(assets: number[] = []) {
    const total: number = _.sum(assets);
    const tax: number = this.fix(total * 0.05);
    this.addForm.get('amount').setValue(total);
    this.addForm.get('grandTotal').setValue(total + tax);
    if (this.addForm.get('isIgst').value === true) {
      this.addForm.get('igst').setValue(tax);
      this.addForm.get('cgst').setValue(null);
      this.addForm.get('sgst').setValue(null);
    } else {
      this.addForm.get('cgst').setValue(tax / 2);
      this.addForm.get('sgst').setValue(tax / 2);
      this.addForm.get('igst').setValue(null);
    }
  }

  fix(value: number): number {
    return Number(value.toPrecision(5));
  }

  createAsset(): any {
    return this.fb.group({
      pairs: null,
      rate: null
    });
  }

  addAsset(): void {
    this.assets = this.addForm.get('assets') as FormArray;
    this.assets.push(this.createAsset());
  }

  removeAsset(index: number) {
    this.assets.removeAt(index);
  }

  onSubmit(formValue: any) {
    formValue = _.omit(formValue, 'isIgst');
    formValue.date = (formValue.date as Date).toLocaleDateString();
    this.dialogRef.close({ ...formValue });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
