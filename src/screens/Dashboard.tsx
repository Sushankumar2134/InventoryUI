import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  FlatList,
  Alert,
} from "react-native";

interface ItemForm {
  name: string;
  code: string;
  category: string;
  unit: string;
  reorder_level: string;
  purchase_price: string;
  selling_price: string;
}

interface InventoryItem {
  id: number;
  name: string;
  code: string;
  category: string;
  unit: string;
  stock: number;
  reorder_level: number;
  purchase_price: number;
  selling_price: number;
  status: "active" | "inactive";
}

const Dashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [form, setForm] = useState<ItemForm>({
    name: "",
    code: "",
    category: "",
    unit: "",
    reorder_level: "",
    purchase_price: "",
    selling_price: "",
  });

  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: 1,
      name: "Paracetamol",
      code: "MED001",
      category: "Medicine",
      unit: "Tablets",
      stock: 5,
      reorder_level: 10,
      purchase_price: 0,
      selling_price: 0,
      status: "active",
    },
    {
      id: 2,
      name: "Akarsh",
      code: "MED002",
      category: "Medicine",
      unit: "Bottles",
      stock: 7,
      reorder_level: 10,
      purchase_price: 0,
      selling_price: 0,
      status: "active",
    },
  ]);

  const categories = ["Medicine", "Equipment", "Consumable"];

  const handleChange = (key: keyof ItemForm, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleAddItem = () => {
    if (!form.name || !form.code || !form.category) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    const newItem: InventoryItem = {
      id: items.length + 1,
      name: form.name,
      code: form.code,
      category: form.category,
      unit: form.unit,
      stock: 0,
      reorder_level: Number(form.reorder_level) || 0,
      purchase_price: Number(form.purchase_price) || 0,
      selling_price: Number(form.selling_price) || 0,
      status: "active",
    };

    setItems([...items, newItem]);
    setForm({
      name: "",
      code: "",
      category: "",
      unit: "",
      reorder_level: "",
      purchase_price: "",
      selling_price: "",
    });
    setShowAddForm(false);
    Alert.alert("Success", "Item added successfully");
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
  );

  const renderItemRow = ({ item }: any) => (
    <View style={styles.tableRow}>
      <Text style={styles.cellId}>{item.id}</Text>
      <Text style={styles.cellName}>{item.name}</Text>
      <Text style={styles.cellCode}>{item.code}</Text>
      <Text style={styles.cellCategory}>{item.category}</Text>
      <Text style={styles.cellUnit}>{item.unit}</Text>
      <Text
        style={[
          styles.cellStock,
          item.stock <= item.reorder_level ? styles.lowStock : styles.normalStock,
        ]}
      >
        {item.stock}
      </Text>
      <Text style={styles.cellReorder}>{item.reorder_level}</Text>
      <View
        style={[
          styles.statusBadge,
          item.status === "active" ? styles.activeStatus : styles.inactiveStatus,
        ]}
      >
        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
      </View>
      <View style={styles.cellActions}>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.btnTextSmall}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn}>
          <Text style={styles.btnTextSmall}>Del</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Search and Buttons */}
      <View style={styles.headerSection}>
        <TextInput
          placeholder="Search by name or code"
          style={styles.search}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.btnText}>+ Add Item</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.btnText}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Item Form - Expandable */}
      {showAddForm && (
        <ScrollView style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Add New Item</Text>
            <TouchableOpacity onPress={() => setShowAddForm(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Two Column Layout */}
          <View style={styles.twoColumnRow}>
            <View style={styles.halfColumn}>
              <Text style={styles.label}>Item Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter item name"
                value={form.name}
                onChangeText={(text) => handleChange("name", text)}
              />
            </View>
            <View style={styles.halfColumn}>
              <Text style={styles.label}>Item Code *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter item code"
                value={form.code}
                onChangeText={(text) => handleChange("code", text)}
              />
            </View>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.halfColumn}>
              <Text style={styles.label}>Category *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text
                  style={
                    form.category ? styles.dropdownText : styles.placeholderText
                  }
                >
                  {form.category || "Select"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.halfColumn}>
              <Text style={styles.label}>Unit</Text>
              <TextInput
                style={styles.input}
                placeholder="Box / Piece / Bottle"
                value={form.unit}
                onChangeText={(text) => handleChange("unit", text)}
              />
            </View>
          </View>

          <View style={styles.twoColumnRow}>
            <View style={styles.halfColumn}>
              <Text style={styles.label}>Reorder Level</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={form.reorder_level}
                onChangeText={(text) => handleChange("reorder_level", text)}
              />
            </View>
            <View style={styles.halfColumn}>
              <Text style={styles.label}>Purchase Price</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="decimal-pad"
                value={form.purchase_price}
                onChangeText={(text) => handleChange("purchase_price", text)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Selling Price</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="decimal-pad"
              value={form.selling_price}
              onChangeText={(text) => handleChange("selling_price", text)}
            />
          </View>

          <View style={styles.formButtonRow}>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddItem}>
              <Text style={styles.submitBtnText}>SAVE ITEM</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowAddForm(false)}
            >
              <Text style={styles.cancelBtnText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Items Table */}
      {!showAddForm && (
        <ScrollView horizontal style={styles.tableWrapper}>
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>#</Text>
              <Text style={styles.headerCell}>Name</Text>
              <Text style={styles.headerCell}>Code</Text>
              <Text style={styles.headerCell}>Category</Text>
              <Text style={styles.headerCell}>Unit</Text>
              <Text style={styles.headerCell}>Stock</Text>
              <Text style={styles.headerCell}>Reorder</Text>
              <Text style={styles.headerCell}>Status</Text>
              <Text style={styles.headerCell}>Action</Text>
            </View>

            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItemRow}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      )}

      {/* Category Modal */}
      <Modal visible={showCategoryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.modalOption}
                onPress={() => {
                  handleChange("category", cat);
                  setShowCategoryModal(false);
                }}
              >
                <Text
                  style={
                    form.category === cat
                      ? styles.modalOptionSelected
                      : styles.modalOptionText
                  }
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
  },
  headerSection: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  search: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  addBtn: {
    flex: 1,
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: "center",
  },
  filterBtn: {
    flex: 1,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  formContainer: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    maxHeight: 450,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  closeBtn: {
    fontSize: 24,
    color: "#999",
  },
  twoColumnRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  halfColumn: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 6,
    fontWeight: "700",
    fontSize: 12,
    color: "#333",
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
    fontSize: 13,
  },
  dropdownButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
    justifyContent: "center",
  },
  dropdownText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
  },
  placeholderText: {
    fontSize: 13,
    color: "#999",
  },
  formButtonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#7f8c8d",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  tableWrapper: {
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4a6fa5",
    paddingHorizontal: 0,
    borderBottomWidth: 2,
    borderBottomColor: "#2c3e50",
  },
  headerCell: {
    width: 100,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
  },
  cellId: {
    width: 100,
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 12,
  },
  cellName: {
    width: 100,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontWeight: "600",
    fontSize: 12,
  },
  cellCode: {
    width: 100,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 11,
  },
  cellCategory: {
    width: 100,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 11,
  },
  cellUnit: {
    width: 100,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 11,
  },
  cellStock: {
    width: 100,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  lowStock: {
    color: "#f44336",
  },
  normalStock: {
    color: "#4caf50",
  },
  cellReorder: {
    width: 100,
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: "center",
    fontSize: 11,
  },
  statusBadge: {
    width: 100,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  activeStatus: {
    backgroundColor: "#4caf50",
  },
  inactiveStatus: {
    backgroundColor: "#f44336",
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
  },
  cellActions: {
    width: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  editBtn: {
    backgroundColor: "#ff9800",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  deleteBtn: {
    backgroundColor: "#f44336",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  btnTextSmall: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "80%",
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalOptionText: {
    fontSize: 14,
    color: "#333",
  },
  modalOptionSelected: {
    fontSize: 14,
    color: "#2ecc71",
    fontWeight: "bold",
  },
});
