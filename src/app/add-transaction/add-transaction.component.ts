import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

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

  ngOnInit() {
    this.addForm = this.fb.group({
      hsn: [64, Validators.required],
      assets: this.fb.array([this.createAsset()]),
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: [0, { disabled: true }]
    });

    this.addForm.get('assets').valueChanges.subscribe(value => {
      value.map(asset => (asset.total = asset.pairs * asset.rate));
    });
  }
  createAsset(): any {
    const form = this.fb.group({
      pairs: 0,
      rate: 0,
      total: 0
    });
    form.get('pairs').valueChanges.subscribe(value => {
      const total: number = form.value.rate * value;
      form.get('total').setValue(total);
    });
    form.get('rate').valueChanges.subscribe(value => {
      const total: number = form.value.pairs * value;
      form.get('total').setValue(total);
    });
    return form;
  }

  addAsset(): void {
    this.assets = this.addForm.get('assets') as FormArray;
    this.assets.push(this.createAsset());
  }

  onSubmit(formValue) {
    this.dialogRef.close({ ...formValue });
  }
}
