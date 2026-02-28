import api from "./api";
import type {
  PurchaseOrder,
  GRN,
  StockTransfer,
  InventoryReport,
  StockAuditPayload,
} from "../types/inventoryTypes";

export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  void api;
  return [
    {
      id: 1,
      po_number: "PO-0001",
      vendor_name: "Alpha Medical",
      order_date: "2026-02-01",
      total_amount: 12500,
      status: "Open",
    },
  ];
};

export const getGRNs = async (): Promise<GRN[]> => {
  void api;
  return [
    {
      id: 1,
      grn_number: "GRN-1001",
      po_number: "PO-0001",
      received_date: "2026-02-05",
      total_amount: 12500,
    },
  ];
};

export const getStockTransfers = async (): Promise<StockTransfer[]> => {
  void api;
  return [
    {
      id: 1,
      transfer_number: "ST-001",
      transfer_date: "2026-02-10",
    },
  ];
};

export const getInventoryReports = async (): Promise<InventoryReport> => {
  void api;
  return {
    summary: {
      total_items: 320,
      low_stock_items: 24,
      total_purchase_orders: 58,
      total_stock_value: 780000,
    },
    recent_purchase_orders: [
      {
        id: 1,
        po_number: "PO-0003",
        vendor_name: "Medix Supplies",
        order_date: "2026-02-20",
        total_amount: 5400,
        status: "Closed",
      },
    ],
    recent_grns: [
      {
        id: 1,
        grn_number: "GRN-1015",
        po_number: "PO-0003",
        received_date: "2026-02-22",
        total_amount: 5400,
      },
    ],
  };
};

export const createStockAudit = async (
  payload: StockAuditPayload
): Promise<{ success: boolean }> => {
  void api;
  void payload;
  return { success: true };
};
