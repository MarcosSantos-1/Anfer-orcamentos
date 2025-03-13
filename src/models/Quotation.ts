// src/models/Quotation.ts
import { Customer } from './Customer';

export interface QuotationItem {
  id: string;
  title: string;       
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  number: string;
  date: string;
  customer: Customer;
  items: QuotationItem[];
  subtotal: number;
  taxes: number;
  taxRate: number;
  shipping: string; // "incluso" ou valor numérico
  total: number;
  paymentInfo: {
    name: string;
    agency: string;
    account: string;
    pix: string;
  };
  notes?: string;
}