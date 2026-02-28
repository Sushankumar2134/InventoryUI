export interface PurchaseOrder {
  id: number;
  po_number: string;
  vendor_name: string;
  order_date: string;
  total_amount: number;
  status: string;
}

export interface GRN {
  id: number;
  grn_number: string;
  po_number: string;
  received_date: string;
  total_amount: number;
}

export interface StockTransfer {
  id: number;
  transfer_number: string;
  transfer_date: string;
}

export interface InventoryReportSummary {
  total_items: number;
  low_stock_items: number;
  total_purchase_orders: number;
  total_stock_value: number;
}

export interface InventoryReport {
  summary: InventoryReportSummary;
  recent_purchase_orders: PurchaseOrder[];
  recent_grns: GRN[];
}

export interface StockAuditPayload {
  item_id: number;
  physical_stock: number;
}
