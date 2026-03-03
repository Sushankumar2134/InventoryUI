import api from "./api";
import type {
  PurchaseOrder,
  GRN,
  StockTransfer,
  InventoryReport,
  StockAuditPayload,
} from "../types/inventoryTypes";

// export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
//   void api;
//   return [
//     {
//       id: 1,
//       po_number: "PO-0001",
//       vendor_name: "Alpha Medical",
//       order_date: "2026-02-01",
//       total_amount: 12500,
//       status: "Open",
//     },
//   ];
// };

export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  try {
    const response = await api.get("/inventory/purchase-orders");

    console.log("PO RESPONSE:", response.data);

    const raw = response.data;

    if (!Array.isArray(raw)) return [];

    return raw.map((po: any) => ({
      id: po.id,
      po_number: po.po_number,
      vendor_name: po.vendor?.vendor_name ?? "N/A",
      order_date: po.order_date,
      total_amount: po.total_amount,
      status: po.status,

      items: po.items ?.map((i:any)=>({
        id: i.id,
        item_id: i.item_id,
        item_name: i.item?.name ?? "N/A",
        quantity: i.quantity,
        unit_price: i.unit_price,
        total: i.total,
      })) ||[],

    }));
  } catch (error) {
    console.error("Fetch PO error:", error);
    return [];
  }
};

export const getGRNs = async (): Promise<GRN[]> => {
  try {
    const response = await api.get("/inventory/grns");

    console.log("GRN API RESPONSE:", response.data);

    const raw = response.data;

    if (!Array.isArray(raw)) return [];

    return raw.map((grn: any) => ({
      id: grn.id,
      grn_number: grn.grn_number ?? `GRN-${grn.id}`,
      po_number: grn.purchase_order?.po_number ?? "N/A",
      received_date: grn.received_date,
      total_amount: grn.total_amount,
    }));

  } catch (error) {
    console.error("Fetch GRN error:", error);
    return [];
  }
};

export const getStockTransfers = async (): Promise<StockTransfer[]> => {
  try {
    const response = await api.get("/inventory/stock-transfers");

    console.log("STOCK TRANSFER RESPONSE:", response.data);

    const raw = response.data;

    if (!Array.isArray(raw)) return [];

    return raw.map((st: any) => ({
      id: st.id,
      transfer_number: st.transfer_number,
      transfer_date: st.transfer_date,
    }));
  } catch (error) {
    console.error("Fetch Stock Transfer error:", error);
    return [];
  }
};

export const getInventoryReports = async (): Promise<any> => {
  try {
    const response = await api.get("/inventory/dashboard");

    console.log("DASHBOARD API:", response.data);

    const raw = response.data;

    return {
      summary: {
        total_items: raw.totalItems,
        low_stock_items: raw.lowStockItems,
        total_purchase_orders: raw.totalPO,
        total_stock_value: raw.totalStockValue,
      },
      recent_purchase_orders: raw.recentPOs ?? [],
      recent_grns: raw.recentGrns ?? [],
    };
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return null;
  }
};

export const createStockAudit = async (
  payload: StockAuditPayload
): Promise<any> => {
  try {
    const response = await api.post(
      "/inventory/stock-audits",
      payload
    );

    console.log("Stock Audit Created:", response.data);

    return response.data;
  } catch (error) {
    console.error("Stock Audit Error:", error);
    throw error;
  }
};


export const getStockAudits = async (): Promise<any[]> => {
  try {
    const response = await api.get("/inventory/stock-audits");
    return response.data;
  } catch (error) {
    return [];
  }
};
// 🔥 GET ALL ITEMS FOR STOCK AUDIT DROPDOWN
export const getItems = async (): Promise<any[]> => {
  try {
    const response = await api.get("/inventory/items");
    console.log("ITEMS API RESPONSE:", response.data);
    return response.data;
  } catch (error) {
    console.log("ITEMS ERROR:", error);
    return [];
  }
};