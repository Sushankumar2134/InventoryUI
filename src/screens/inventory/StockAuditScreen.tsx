import React, { useState } from "react";
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
import { createStockAudit } from "../../services/inventoryService";

interface AuditItem {
  id: number;
  name: string;
  system_stock: number;
}

interface AuditRecord {
  id: number;
  item_name: string;
  system_stock: number;
  physical_stock: number;
  difference: number;
  date: string;
}

// 🔥 Later fetch from Laravel API
const knownItems: AuditItem[] = [
  { id: 1, name: "Paracetamol", system_stock: 150 },
  { id: 2, name: "Surgical Gloves", system_stock: 8 },
  { id: 3, name: "IV Drip Set", system_stock: 45 },
  { id: 4, name: "Amoxicillin", system_stock: 5 },
  { id: 5, name: "Syringe", system_stock: 100 },
  { id: 6, name: "Bandage", system_stock: 150 },
];

const StockAuditScreen: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [selectedItem, setSelectedItem] = useState<AuditItem | null>(null);
  const [physicalStock, setPhysicalStock] = useState("");

  // Audits list
  const [audits, setAudits] = useState<AuditRecord[]>([]);

  const resetForm = () => {
    setSelectedItem(null);
    setPhysicalStock("");
  };

  const handleSubmit = async () => {
    if (!selectedItem) {
      Alert.alert("Validation", "Please select an item.");
      return;
    }
    if (!physicalStock) {
      Alert.alert("Validation", "Please enter physical stock.");
      return;
    }

    setLoading(true);
    await createStockAudit({
      item_id: selectedItem.id,
      physical_stock: Number(physicalStock) || 0,
    });
    setLoading(false);

    const physical = Number(physicalStock) || 0;
    const difference = physical - selectedItem.system_stock;

    const newAudit: AuditRecord = {
      id: audits.length + 1,
      item_name: selectedItem.name,
      system_stock: selectedItem.system_stock,
      physical_stock: physical,
      difference,
      date: new Date().toISOString().split("T")[0],
    };

    setAudits([newAudit, ...audits]);
    resetForm();
    setShowForm(false);
    Alert.alert("Success", "Stock audit submitted.");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Stock Audits</Text>
        <TouchableOpacity
          style={styles.newAuditBtn}
          onPress={() => {
            if (showForm) resetForm();
            setShowForm(!showForm);
          }}
        >
          <Text style={styles.newAuditBtnText}>
            {showForm ? "Close Form" : "NEW AUDIT"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── New Audit Form ── */}
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>New Stock Audit</Text>

            {/* Select Item */}
            <Text style={styles.label}>Select Item</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowItemModal(true)}
            >
              <Text
                style={
                  selectedItem ? styles.dropdownTextSelected : styles.dropdownText
                }
              >
                {selectedItem ? selectedItem.name : "Select Item"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#9ca3af" />
            </TouchableOpacity>

            {/* System Stock (read-only) */}
            {selectedItem && (
              <View style={styles.systemStockRow}>
                <Text style={styles.systemStockLabel}>System Stock:</Text>
                <Text style={styles.systemStockValue}>
                  {selectedItem.system_stock}
                </Text>
              </View>
            )}

            {/* Physical Stock */}
            <Text style={styles.label}>Physical Stock</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter physical stock"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={physicalStock}
              onChangeText={setPhysicalStock}
            />

            {/* Complete Audit Button */}
            <TouchableOpacity
              style={[
                styles.completeBtn,
                loading ? styles.completeBtnDisabled : null,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.completeBtnText}>
                {loading ? "Submitting..." : "Complete Audit"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Audits Table ── */}
        {!showForm && (
          audits.length === 0 ? (
            <View style={styles.tableWrap}>
              <TableHeader
                columns={[
                  { key: "id", label: "#", width: 40 },
                  { key: "item", label: "Item", width: 120 },
                  { key: "system", label: "System Stock", width: 110 },
                  { key: "physical", label: "Physical Stock", width: 110 },
                  { key: "diff", label: "Difference", width: 100 },
                  { key: "date", label: "Date", width: 110 },
                ]}
              />
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No audits found</Text>
              </View>
            </View>
          ) : (
            <ScrollView horizontal style={styles.tableWrap}>
              <View>
                <TableHeader
                  columns={[
                    { key: "id", label: "#", width: 40 },
                    { key: "item", label: "Item", width: 120 },
                    { key: "system", label: "System Stock", width: 110 },
                    { key: "physical", label: "Physical Stock", width: 110 },
                    { key: "diff", label: "Difference", width: 100 },
                    { key: "date", label: "Date", width: 110 },
                  ]}
                />
                {audits.map((audit, idx) => (
                  <TableRow
                    key={audit.id}
                    cells={[
                      { key: "id", value: idx + 1, width: 40 },
                      { key: "item", value: audit.item_name, width: 120 },
                      { key: "system", value: audit.system_stock, width: 110 },
                      { key: "physical", value: audit.physical_stock, width: 110 },
                      {
                        key: "diff",
                        value: audit.difference,
                        width: 100,
                      },
                      { key: "date", value: audit.date, width: 110 },
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
            <ScrollView>
              {knownItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.modalOption,
                    selectedItem?.id === item.id && styles.modalOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedItem(item);
                    setShowItemModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedItem?.id === item.id &&
                        styles.modalOptionTextActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {selectedItem?.id === item.id && (
                    <Ionicons name="checkmark" size={18} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default StockAuditScreen;

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
  newAuditBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  newAuditBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },

  /* Table */
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
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  dropdown: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    color: "#9ca3af",
    fontSize: 13,
  },
  dropdownTextSelected: {
    color: "#111827",
    fontSize: 13,
  },
  systemStockRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    padding: 10,
    borderRadius: 6,
    marginBottom: 14,
  },
  systemStockLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginRight: 8,
  },
  systemStockValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#16a34a",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 13,
    color: "#111827",
  },
  completeBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  completeBtnDisabled: {
    opacity: 0.7,
  },
  completeBtnText: {
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
