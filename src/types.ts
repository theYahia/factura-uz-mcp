export interface FacturaInvoice {
  id: string;
  number: string;
  date: string;
  status: string;
  seller: FacturaParty;
  buyer: FacturaParty;
  items: FacturaItem[];
  contract_id?: string;
  total_amount: number;
  vat_amount: number;
  created_at: string;
}

export interface FacturaParty {
  inn: string;
  name: string;
  address?: string;
  account?: string;
  bank_id?: string;
  director?: string;
  accountant?: string;
}

export interface FacturaItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  amount: number;
  vat_rate: number;
  vat_amount: number;
  catalog_code?: string;
  package_code?: string;
}

export interface FacturaCompany {
  inn: string;
  name: string;
  address: string;
  director?: string;
  accountant?: string;
  status: string;
}

export interface FacturaProduct {
  code: string;
  name: string;
  unit: string;
  package_code?: string;
}

export interface FacturaError {
  error?: {
    code: string;
    message: string;
  };
}
