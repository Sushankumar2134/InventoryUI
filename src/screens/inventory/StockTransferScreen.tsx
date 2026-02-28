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
import { getStockTransfers } from "../../services/inventoryService";
import type { StockTransfer } from "../../types/inventoryTypes";

interface TransferItem {
  item_name: string;
  available_stock: string;
  quantity: string;
}

// 🔥 Later fetch from Laravel API
const knownItems: { name: string; stock: number }[] = [
  { name: "Paracetamol", stock: 50 },
  { name: "Surgical Gloves", stock: 200 },
  { name: "IV Drip Set", stock: 30 },
  { name: "Amoxicillin", stock: 75 },
  { name: "Syringe", stock: 100 },
  { name: "Bandage", stock: 150 },
];

const StockTransferScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [transferDate, setTransferDate] = useState("");
  const [transferItems, setTransferItems] = useState<TransferItem[]>([
    { item_name: "", available_stock: "Auto", quantity: "" },
  ]);

  // Modal state
  const [showItemModal, setShowItemModal] = useState(false);
  const [activeRowIndex, setActiveRowIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getStockTransfers();
      setTransfers(data);
      setLoading(false);
    };
    void load();
  }, []);

  const addItemRow = () => {
    setTransferItems([
      ...transferItems,
      { item_name: "", available_stock: "Auto", quantity: "" },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (transferItems.length === 1) return;
    const updated = [...transferItems];
    updated.splice(index, 1);
    setTransferItems(updated);
  };

  const selectItem = (index: number, itemName: string) => {
    const updated = [...transferItems];
    updated[index] = { ...updated[index], item_name: itemName };

    // Auto-fill available stock based on item match
    const matched = knownItems.find(
      (i) => i.name.toLowerCase() === itemName.toLowerCase()
    );
    updated[index].available_stock = matched
      ? matched.stock.toString()
      : "Auto";

    setTransferItems(updated);
  };

  const handleQuantityChange = (index: number, value: string) => {
    const updated = [...transferItems];
    updated[index] = { ...updated[index], quantity: value };
    setTransferItems(updated);
  };

  const resetForm = () => {
    setTransferDate("");
    setTransferItems([{ item_name: "", available_stock: "Auto", quantity: "" }]);
  };

  const handleSave = () => {
    if (!transferDate) {
      Alert.alert("Missing Fields", "Please enter transfer date");
      return;
    }
    const hasItems = transferItems.some((i) => i.item_name && i.quantity);
    if (!hasItems) {
      Alert.alert("Missing Fields", "Please add at least one item with quantity");
      return;
    }

    const newTransfer: StockTransfer = {
      id: transfers.length + 1,
      transfer_number: `TR-${String(transfers.length + 1).padStart(3, "0")}`,
      transfer_date: transferDate,
    };

    setTransfers([newTransfer, ...transfers]);
    resetForm();
    setShowForm(false);
    Alert.alert("Success", "Stock Transfer created successfully");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Stock Transfers</Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => {
            if (showForm) resetForm();
            setShowForm(!showForm);
          }}
        >
          <Text style={styles.primaryBtnText}>
            {showForm ? "Close Form" : "CREATE TRANSFER"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Create Transfer Form ── */}
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Create Stock Transfer</Text>

            {/* Transfer Date */}
            <Text style={styles.label}>Transfer Date</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="mm/dd/yyyy"
              placeholderTextColor="#9ca3af"
              value={transferDate}
              onChangeText={setTransferDate}
            />

            {/* Items Table Header */}
            <View style={styles.itemsTableHeader}>
              <Text style={[styles.itemHeaderCell, { flex: 2 }]}>Item</Text>
              <Text style={[styles.itemHeaderCell, { flex: 1.5 }]}>Available Stock</Text>
              <Text style={[styles.itemHeaderCell, { flex: 1.5 }]}>Quantity</Text>
              <Text style={[styles.itemHeaderCell, { width: 40 }]}></Text>
            </View>

            {/* Items Rows */}
            {transferItems.map((tItem, index) => (
              <View key={index} style={styles.itemRow}>
                {/* Item Dropdown */}
                <TouchableOpacity
                  style={[styles.itemCell, { flex: 2 }]}
                  onPress={() => {
                    setActiveRowIndex(index);
                    setShowItemModal(true);
                  }}
                >
                  <Text
                    style={
                      tItem.item_name ? styles.cellText : styles.placeholderText
                    }
                    numberOfLines={1}
                  >
                    {tItem.item_name || "Select Item"}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color="#9ca3af" />
                </TouchableOpacity>

                {/* Available Stock (Auto) */}
                <View style={[styles.stockCell, { flex: 1.5 }]}>
                  <Text style={styles.stockText}>{tItem.available_stock}</Text>
                </View>

                {/* Quantity Input */}
                <View style={{ flex: 1.5, marginRight: 6 }}>
                  <TextInput
                    style={styles.itemInput}
                    placeholder=""
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={tItem.quantity}
                    onChangeText={(t) => handleQuantityChange(index, t)}
                  />
                </View>

                {/* Remove Button */}
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeItemRow(index)}
                >
                  <Text style={styles.removeText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Item Button */}
            <TouchableOpacity style={styles.addItemBtn} onPress={addItemRow}>
              <Text style={styles.addItemBtnText}>ADD ITEM</Text>
            </TouchableOpacity>

            {/* Transfer Button */}
            <TouchableOpacity style={styles.transferBtn} onPress={handleSave}>
              <Text style={styles.transferBtnText}>TRANSFER</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Transfers Table ── */}
        {!showForm && (
          loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : transfers.length === 0 ? (
            <View style={styles.tableWrap}>
              <TableHeader
                columns={[
                  { key: "id", label: "#", width: 60 },
                  { key: "transfer", label: "TRANSFER NUMBER", width: 200 },
                  { key: "date", label: "TRANSFER DATE", width: 200 },
                ]}
              />
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No Transfers Found</Text>
              </View>
            </View>
          ) : (
            <ScrollView horizontal style={styles.tableWrap}>
              <View>
                <TableHeader
                  columns={[
                    { key: "id", label: "#", width: 60 },
                    { key: "transfer", label: "TRANSFER NUMBER", width: 200 },
                    { key: "date", label: "TRANSFER DATE", width: 200 },
                  ]}
                />
                {transfers.map((item, idx) => (
                  <TableRow
                    key={item.id}
                    cells={[
                      { key: "id", value: idx + 1, width: 60 },
                      { key: "transfer", value: item.transfer_number, width: 200 },
                      { key: "date", value: item.transfer_date, width: 200 },
                    ]}
                  />
                ))}
              </View>
            </ScrollView>
          )
        )}
      </ScrollView>

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
            {knownItems.map((it) => (
              <TouchableOpacity
                key={it.name}
                style={[
                  styles.modalOption,
                  transferItems[activeRowIndex]?.item_name === it.name &&
                    styles.modalOptionActive,
                ]}
                onPress={() => {
                  selectItem(activeRowIndex, it.name);
                  setShowItemModal(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    transferItems[activeRowIndex]?.item_name === it.name &&
                      styles.modalOptionTextActive,
                  ]}
                >
                  {it.name}
                </Text>
                {transferItems[activeRowIndex]?.item_name === it.name && (
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

export default StockTransferScreen;

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
  emptyRow: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 13,
  },

  /* Form */
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 10,
  },
  label: {
    marginBottom: 4,
    fontWeight: "600",
    fontSize: 13,
    color: "#374151",
  },
  dateInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 10,
    borderRadius: 6,
    fontSize: 14,
    color: "#111827",
    marginBottom: 20,
  },

  /* Items Table */
  itemsTableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  itemHeaderCell: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  itemInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    borderRadius: 4,
    fontSize: 13,
    color: "#111827",
  },
  stockCell: {
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  stockText: {
    fontSize: 13,
    color: "#6b7280",
  },
  itemCell: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    borderRadius: 4,
    marginRight: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cellText: {
    fontSize: 13,
    color: "#111827",
  },
  placeholderText: {
    fontSize: 13,
    color: "#9ca3af",
  },
  removeBtn: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ef4444",
  },

  /* Buttons */
  addItemBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 14,
  },
  addItemBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  transferBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  transferBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
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
