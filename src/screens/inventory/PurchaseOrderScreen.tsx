import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TableHeader from "../../components/TableHeader";
import TableRow from "../../components/TableRow";
import EmptyState from "../../components/EmptyState";
import { getPurchaseOrders } from "../../services/inventoryService";
import type { PurchaseOrder } from "../../types/inventoryTypes";

interface POItem {
  item_name: string;
  quantity: string;
  unit_price: string;
}

const vendorList = ["Alpha Medical", "Medix Supplies", "HealthCare Plus", "PharmaCo"];
const itemList = ["Paracetamol", "Surgical Gloves", "IV Drip Set", "Amoxicillin", "Syringe", "Bandage"];

const PurchaseOrderScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [vendor, setVendor] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [poItems, setPoItems] = useState<POItem[]>([
    { item_name: "", quantity: "", unit_price: "" },
  ]);

  // Modal state
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getPurchaseOrders();
      setOrders(data);
      setLoading(false);
    };
    void load();
  }, []);

  const addItemRow = () => {
    setPoItems([...poItems, { item_name: "", quantity: "", unit_price: "" }]);
  };

  const removeItemRow = (index: number) => {
    if (poItems.length === 1) return;
    const updated = [...poItems];
    updated.splice(index, 1);
    setPoItems(updated);
  };

  const updatePoItem = (index: number, key: keyof POItem, value: string) => {
    const updated = [...poItems];
    updated[index] = { ...updated[index], [key]: value };
    setPoItems(updated);
  };

  const getRowTotal = (item: POItem) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unit_price) || 0;
    return (qty * price).toFixed(2);
  };

  const grandTotal = poItems
    .reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unit_price) || 0;
      return sum + qty * price;
    }, 0)
    .toFixed(2);

  const resetForm = () => {
    setVendor("");
    setOrderDate("");
    setDeliveryDate("");
    setPoItems([{ item_name: "", quantity: "", unit_price: "" }]);
  };

  const handleSave = () => {
    if (!vendor) {
      Alert.alert("Missing Fields", "Please select a vendor");
      return;
    }
    if (!orderDate) {
      Alert.alert("Missing Fields", "Please enter order date");
      return;
    }
    const hasItems = poItems.some((i) => i.item_name && i.quantity && i.unit_price);
    if (!hasItems) {
      Alert.alert("Missing Fields", "Please add at least one item with quantity and price");
      return;
    }

    const newOrder: PurchaseOrder = {
      id: orders.length + 1,
      po_number: `PO-${String(orders.length + 1).padStart(4, "0")}`,
      vendor_name: vendor,
      order_date: orderDate,
      total_amount: parseFloat(grandTotal),
      status: "Open",
    };

    setOrders([newOrder, ...orders]);
    resetForm();
    setShowForm(false);
    Alert.alert("Success", "Purchase Order created successfully");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Purchase Orders</Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => {
            if (showForm) resetForm();
            setShowForm(!showForm);
          }}
        >
          <Text style={styles.primaryBtnText}>
            {showForm ? "Close Form" : "Create Purchase Order"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Create Purchase Order Form ── */}
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Create Purchase Order</Text>

            {/* Vendor, Order Date, Delivery Date */}
            <View style={styles.row}>
              <View style={styles.thirdCol}>
                <Text style={styles.label}>Vendor</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowVendorModal(true)}
                >
                  <Text style={vendor ? styles.dropdownText : styles.placeholderText}>
                    {vendor || "Select Vendor"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
              <View style={styles.thirdCol}>
                <Text style={styles.label}>Order Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="mm/dd/yyyy"
                  placeholderTextColor="#9ca3af"
                  value={orderDate}
                  onChangeText={setOrderDate}
                />
              </View>
              <View style={styles.thirdCol}>
                <Text style={styles.label}>Expected Delivery Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="mm/dd/yyyy"
                  placeholderTextColor="#9ca3af"
                  value={deliveryDate}
                  onChangeText={setDeliveryDate}
                />
              </View>
            </View>

            {/* Items Section */}
            <Text style={styles.itemsSectionTitle}>Items</Text>

            {/* Items Table Header */}
            <View style={styles.itemsTableHeader}>
              <Text style={[styles.itemHeaderCell, { flex: 2 }]}>Item</Text>
              <Text style={[styles.itemHeaderCell, { flex: 1 }]}>Quantity</Text>
              <Text style={[styles.itemHeaderCell, { flex: 1 }]}>Unit Price</Text>
              <Text style={[styles.itemHeaderCell, { flex: 1 }]}>Total</Text>
              <Text style={[styles.itemHeaderCell, { width: 40 }]}>Action</Text>
            </View>

            {/* Items Rows */}
            {poItems.map((poItem, index) => (
              <View key={index} style={styles.itemRow}>
                <TouchableOpacity
                  style={[styles.itemCell, { flex: 2 }]}
                  onPress={() => {
                    setActiveItemIndex(index);
                    setShowItemModal(true);
                  }}
                >
                  <Text
                    style={
                      poItem.item_name ? styles.dropdownText : styles.placeholderText
                    }
                  >
                    {poItem.item_name || "Select Item"}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color="#9ca3af" />
                </TouchableOpacity>
                <TextInput
                  style={[styles.itemInput, { flex: 1 }]}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={poItem.quantity}
                  onChangeText={(t) => updatePoItem(index, "quantity", t)}
                />
                <TextInput
                  style={[styles.itemInput, { flex: 1 }]}
                  placeholder="0.00"
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                  value={poItem.unit_price}
                  onChangeText={(t) => updatePoItem(index, "unit_price", t)}
                />
                <View style={[styles.totalCell, { flex: 1 }]}>
                  <Text style={styles.totalText}>{getRowTotal(poItem)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeItemRow(index)}
                >
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Item Button */}
            <TouchableOpacity style={styles.addItemBtn} onPress={addItemRow}>
              <Text style={styles.addItemBtnText}>+ ADD ITEM</Text>
            </TouchableOpacity>

            {/* Grand Total */}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total:</Text>
              <Text style={styles.grandTotalValue}>₹ {grandTotal}</Text>
            </View>

            {/* Save / Cancel */}
            <View style={styles.formBtnRow}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Ionicons name="save-outline" size={16} color="#fff" />
                <Text style={styles.saveBtnText}>SAVE PURCHASE ORDER</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Purchase Orders Table ── */}
        {!showForm && (
          loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : orders.length === 0 ? (
            <EmptyState
              title="No Purchase Orders"
              message="Purchase orders will appear here once created."
            />
          ) : (
            <ScrollView horizontal style={styles.tableWrap}>
              <View>
                <TableHeader
                  columns={[
                    { key: "po", label: "PO Number", width: 120 },
                    { key: "vendor", label: "Vendor", width: 160 },
                    { key: "date", label: "Order Date", width: 120 },
                    { key: "total", label: "Total Amount", width: 140 },
                    { key: "status", label: "Status", width: 120 },
                  ]}
                />
                {orders.map((item) => (
                  <TableRow
                    key={item.id}
                    cells={[
                      { key: "po", value: item.po_number, width: 120 },
                      { key: "vendor", value: item.vendor_name, width: 160, align: "left" },
                      { key: "date", value: item.order_date, width: 120 },
                      { key: "total", value: item.total_amount, width: 140 },
                      { key: "status", value: item.status, width: 120 },
                    ]}
                  />
                ))}
              </View>
            </ScrollView>
          )
        )}
      </ScrollView>

      {/* ── Vendor Modal ── */}
      <Modal visible={showVendorModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowVendorModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Vendor</Text>
              <TouchableOpacity onPress={() => setShowVendorModal(false)}>
                <Ionicons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>
            {vendorList.map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.modalOption, vendor === v && styles.modalOptionActive]}
                onPress={() => {
                  setVendor(v);
                  setShowVendorModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    vendor === v && styles.modalOptionTextActive,
                  ]}
                >
                  {v}
                </Text>
                {vendor === v && <Ionicons name="checkmark" size={18} color="#3b82f6" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Item Select Modal ── */}
      <Modal visible={showItemModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowItemModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Item</Text>
              <TouchableOpacity onPress={() => setShowItemModal(false)}>
                <Ionicons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>
            {itemList.map((it) => (
              <TouchableOpacity
                key={it}
                style={[
                  styles.modalOption,
                  poItems[activeItemIndex]?.item_name === it && styles.modalOptionActive,
                ]}
                onPress={() => {
                  updatePoItem(activeItemIndex, "item_name", it);
                  setShowItemModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    poItems[activeItemIndex]?.item_name === it &&
                      styles.modalOptionTextActive,
                  ]}
                >
                  {it}
                </Text>
                {poItems[activeItemIndex]?.item_name === it && (
                  <Ionicons name="checkmark" size={18} color="#3b82f6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PurchaseOrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  loadingText: {
    color: "#6b7280",
    fontSize: 12,
  },
  tableWrap: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  /* Form Card */
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  thirdCol: {
    flex: 1,
  },
  label: {
    marginBottom: 4,
    fontWeight: "600",
    fontSize: 12,
    color: "#374151",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    borderRadius: 6,
    fontSize: 13,
    color: "#111827",
  },
  dropdown: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 13,
    color: "#111827",
  },
  placeholderText: {
    fontSize: 13,
    color: "#9ca3af",
  },

  /* Items Section */
  itemsSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    marginTop: 4,
  },
  itemsTableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  itemHeaderCell: {
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  itemCell: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 8,
    borderRadius: 4,
    marginRight: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 8,
    borderRadius: 4,
    marginRight: 6,
    fontSize: 12,
    color: "#111827",
    textAlign: "center",
  },
  totalCell: {
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 4,
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  totalText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  removeBtn: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Add Item Row Button */
  addItemBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  addItemBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },

  /* Grand Total */
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginRight: 8,
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  /* Form Buttons */
  formBtnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 6,
  },
  saveBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
  },
  cancelBtnText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 12,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "82%",
    maxHeight: "55%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  modalOptionActive: {
    backgroundColor: "#eff6ff",
  },
  modalOptionText: {
    fontSize: 13,
    color: "#374151",
  },
  modalOptionTextActive: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});
