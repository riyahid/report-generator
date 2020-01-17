export class Transaction {
  type: string;
  amount: number;
  id: string;
  invNo: number;
  hsn: number;
  assets?: {
    pairs: number;
    rate: number;
    cgst?: number;
    sgst?: number;
    igst?: number;
  };
}
