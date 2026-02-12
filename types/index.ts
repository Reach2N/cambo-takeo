export type Currency = "USD" | "KHR";

export interface Activity {
  qrString?: string;
  amount?: string;
  currency?: Currency;
  merchantName?: string;
  status?: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  invoiceNumber?: string;
  billNumber?: string;
  storeLabel?: string;
  terminalLabel?: string;
  purposeOfTransaction?: string;
  transactionDetails?: {
    payerName?: string;
    payerAccount?: string;
    paidAt?: string;
  };
}
