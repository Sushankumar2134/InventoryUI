// src/screens/inventory/CreateStockTransferScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

interface Item {
  id: number;
  name: string;
  stock: number;
}

interface TransferItem {
  item_name: string;
  available_stock: string;
  quantity: string;
}

const CreateStockTransferScreen = () => {
  const [transferDate, setTransferDate] = useState("");
  const [transferItems, setTransferItems] = useState<TransferItem[]>([
    { item_name: "", available_stock: "Auto", quantity: "" },
  ]);

  // 🔥 Later fetch from Laravel API
  const [items] = useState<Item[]>([
    { id: 1, name: "Paracetamol", stock: 50 },
    { id: 2, name: "Syringe", stock: 100 },
    { id: 3, name: "Surgical Gloves", stock: 200 },
    { id: 4, name: "IV Drip Set", stock: 30 },
    { id: 5, name: "Amoxicillin", stock: 75 },
    { id: 6, name: "Bandage", stock: 150 },
  ]);

  const addRow = () => {
    setTransferItems([
      ...transferItems,
      { item_name: "", available_stock: "Auto", quantity: "" },
    ]);
  };

  const removeRow = (index: number) => {
    if (transferItems.length === 1) return;
    const updated = [...transferItems];
    updated.splice(index, 1);
    setTransferItems(updated);
  };

  const handleItemNameChange = (value: string, index: number) => {
    const updated = [...transferItems];
    updated[index].item_name = value;

    // Auto-fill available stock based on item match
    const matchedItem = items.find(
      (i) => i.name.toLowerCase() === value.toLowerCase()
    );
    updated[index].available_stock = matchedItem
      ? matchedItem.stock.toString()
      : "Auto";

    setTransferItems(updated);
  };

  const handleQuantityChange = (value: string, index: number) => {
    const updated = [...transferItems];
    updated[index].quantity = value;
    setTransferItems(updated);
  };

  const handleSubmit = () => {
    if (!transferDate) {
      Alert.alert("Missing Fields", "Please enter transfer date");
      return;
    }
    const hasItems = transferItems.some((i) => i.item_name && i.quantity);
    if (!hasItems) {
      Alert.alert(
        "Missing Fields",
        "Please add at least one item with quantity"
      );
      return;
    }
    Alert.alert("Success", "Stock Transfer created successfully");

    // 🔥 API integration later
    /*
    fetch("http://your-api-url/api/stock-transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transfer_date: transferDate,
        items: transferItems,
      }),
    });
    */
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Stock Transfer</Text>

      {/* Transfer Date */}
      <Text style={styles.label}>Transfer Date</Text>
      <TextInput
        placeholder="mm/dd/yyyy"
        placeholderTextColor="#9ca3af"
        style={styles.dateInput}
        value={transferDate}
        onChangeText={setTransferDate}
      />

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 2 }]}>Item</Text>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>Available Stock</Text>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>Quantity</Text>
        <Text style={[styles.headerCell, { width: 40 }]}></Text>
      </View>

      {/* Table Rows */}
      {transferItems.map((tItem, index) => (
        <View key={index} style={styles.tableRow}>
          {/* Item Name Input */}
          <View style={{ flex: 2, marginRight: 6 }}>
            <TextInput
              style={styles.cellInput}
              placeholder="Enter item"
              placeholderTextColor="#9ca3af"
              value={tItem.item_name}
              onChangeText={(value) => handleItemNameChange(value, index)}
            />
          </View>

          {/* Available Stock (Auto) */}
          <View style={[styles.stockCell, { flex: 1.5 }]}>
            <Text style={styles.stockText}>{tItem.available_stock}</Text>
          </View>

          {/* Quantity Input */}
          <View style={{ flex: 1.5, marginRight: 6 }}>
            <TextInput
              style={styles.cellInput}
              placeholder=""
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={tItem.quantity}
              onChangeText={(value) => handleQuantityChange(value, index)}
            />
          </View>

          {/* Remove Button */}
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => removeRow(index)}
          >
            <Text style={styles.removeText}>X</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Add Item Button */}
      <TouchableOpacity style={styles.addBtn} onPress={addRow}>
        <Text style={styles.addBtnText}>ADD ITEM</Text>
      </TouchableOpacity>

      {/* Transfer Button */}
      <TouchableOpacity style={styles.transferBtn} onPress={handleSubmit}>
        <Text style={styles.transferBtnText}>TRANSFER</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateStockTransferScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f6f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    fontSize: 13,
    color: "#374151",
    marginBottom: 4,
  },
  dateInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 10,
    borderRadius: 6,
    fontSize: 14,
    color: "#111827",
    marginBottom: 20,
  },

  /* Table */
  tableHeader: {
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
  headerCell: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  cellInput: {
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
  addBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 14,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  transferBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 12,
    marginBottom: 30,
  },
  transferBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});