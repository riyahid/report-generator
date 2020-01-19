export class Transaction {
  invno: number;
  type: string;
  amount: number;
  id?: string;
  hsn: number;
  assets: Asset[];
  date: Date;
  particulars: string;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
}

export class Asset {
  pairs: number;
  rate: number;
}
