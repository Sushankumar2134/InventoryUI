// src/screens/inventory/AddItemScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Ionicons,MaterialIcons } from "@expo/vector-icons";
import TableHeader from "../../components/TableHeader";
import TableRow from "../../components/TableRow";
import EmptyState from "../../components/EmptyState";
import { useTheme } from "@react-navigation/native";
// import api from ". ./. ./services/api"; 
// import { useEffect } from "react";


//import React, { useState, useEffect} from "react";
import api from "../../services/api";



// Placeholder for future API integration
interface InventoryItem {
  id: number;
  name: string;
  code: string;
  category: string;
  unit: string;
  stock: number;
  reorder_level: number;
  status: string;
}

const AddItemScreen: React.FC = ({ navigation }: any) => {
  const [showForm, setShowForm] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const { colors } = useTheme();
  const [items, setItems] = useState<InventoryItem[]>([
    // {
    //   id: 1,
    //   name: "Paracetamol",
    //   code: "MED001",
    //   category: "Medicine",
  
    // {
    //   id: 2,
    //   name: "Surgical Gloves",
    //   code: "EQP002",
    //   category: "Equipment",
    //   unit: "Box",
    //   stock: 8,
    //   reorder_level: 20,
    //   status: "active",
    // },
    // {
    //   id: 3,
    //   name: "IV Drip Set",
    //   code: "CON003",
    //   category: "Consumable",
    //   unit: "Piece",
    //   stock: 45,
    //   reorder_level: 30,
    //   status: "active",
    // },
    // {
    //   id: 4,
    //   name: "Amoxicillin",
    //   code: "MED004",
    //   category: "Medicine",
    //   unit: "Strip",
    //   stock: 5,
    //   reorder_level: 25,
    //   status: "inactive",
    //},
  ]);

useEffect(() => {fetchItems()},[]);

const fetchItems = async () => {
  try {
    const response = await api.get("/inventory/items");
console.log("ADD SCREEN RESPONSE:", response.data);

    const data=response.data;
    if(Array.isArray(data)){
      setItems(data);
    }else if(Array.isArray(data.data)){
      setItems(data.data);
    
    } else {
      setItems([]);
    }
   // setItems(response.data);
  } catch (error: any) {
    console.error(error?.message);
    //Alert.alert("Error", "Failed to fetch inventory items.");
  setItems([]);
  }
};


  const [form, setForm] = useState({
    name: "",
    code: "",
    category: "",
    unit: "",
    reorder_level: "",
    purchase_price: "",
    selling_price: "",
    status: "active",
    stock: "0",
  });

  // const categories = ["Medicine", "Equipment", "Consumable", "Surgical", "Lab","others"];
const [newCategory, setNewCategory] = useState("");
const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

const [categories, setCategories] = useState<string[]>([
  "Medicine",
  "Equipment",
  "Consumable",
  "Others",
]);
const otherOptions="Others";


  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.code || !form.category) {
      Alert.alert("Missing Fields", "Please fill Name, Code & Category");
      return;
    }

    // Prepare payload for backend
    const payload = {
      name: form.name,
      code: form.code,
      category: form.category,
      unit: form.unit,
      stock: Number(form.stock) || 0,
      reorder_level: Number(form.reorder_level) || 0,
      status: form.status,
      purchase_price: Number(form.purchase_price) || 0,
      selling_price: Number(form.selling_price) || 0,
    };

    // POST to backend
    api.post("/inventory/items", payload)
      .then((response) => {
        // If backend returns the new item, add to UI
        const newItem = response.data?.data || response.data;
        if (newItem && newItem.id) {
          setItems([newItem, ...items]);
          resetForm();
          setShowForm(false);
          Alert.alert("Success", "Item added to inventory");
        } else {
          Alert.alert("Error", "Unexpected response from server.");
        }
      })
      .catch((error) => {
        console.error("POST error:", error);
        Alert.alert("Error", "Failed to add item. Please try again.");
      });
  };

  const resetForm = () => {
    setForm({
      name: "",
      code: "",
      category: "",
      unit: "",
      reorder_level: "",
      purchase_price: "",
      selling_price: "",
      status: "active",
      stock: "0",
    });
  };

//   const handleDelete = (id: number) => {
//     Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         //onPress: () => setItems(items.filter((i) => i.id !== id)),
//         onPress: ()  async=>(){
//           try{
//             await api.delete(`/inventory/items/${id}`);

// await fetchitems();

//             //remove from ui after backend delete sucess
//             //setItems((prev)=>prev.filter((item)=>item.id !== id));
//             Alert.alert("sucess", "Item has been deleted permanently.");
//           }catch(error){
//             console.error("Delete error:", error);
//             Alert.alert("Error", "Failed to delete item. Please try again.");
//           }
//       },
//     ]);
//   };
const handleDelete = (id: number) => {
  Alert.alert(
    "Delete Item",
    "Are you sure you want to delete this item permanently?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/inventory/items/${id}`);

            // 🔥 refresh list from backend
            await fetchItems(); 

            Alert.alert("Success", "Item has been deleted permanently.");
          } catch (error) {
            console.error("Delete error:", error);
            Alert.alert("Error", "Failed to delete item. Please try again.");
          }
        },
      },
    ]
  );
};
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Inventory Items</Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => {
            if (showForm) resetForm();
            setShowForm(!showForm);
          }}
        >
          <Text style={styles.primaryBtnText}>
            {showForm ? "Close Form" : "Add Item"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Collapsible Add Form */}
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add New Item</Text>

            {/* Name & Code */}
            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.label}>
                  Item Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter item name"
                  placeholderTextColor="#9ca3af"
                  value={form.name}
                  onChangeText={(t) => handleChange("name", t)}
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.label}>
                  Item Code <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. MED001"
                  placeholderTextColor="#9ca3af"
                  value={form.code}
                  onChangeText={(t) => handleChange("code", t)}
                />
              </View>
            </View>

            {/* Category & Unit */}
            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.label}>
                  Category <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowCategoryModal(true)}
                >
                  <Text
                    style={
                      form.category ? styles.dropdownText : styles.placeholderText
                    }
                  >
                    {form.category || "Select category"}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.label}>Unit</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Box / Piece / Strip"
                  placeholderTextColor="#9ca3af"
                  value={form.unit}
                  onChangeText={(t) => handleChange("unit", t)}
                />
              </View>
            </View>

            {/* Reorder & Purchase Price */}
            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.label}>Reorder Level</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={form.reorder_level}
                  onChangeText={(t) => handleChange("reorder_level", t)}
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.label}>Purchase Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                  value={form.purchase_price}
                  onChangeText={(t) => handleChange("purchase_price", t)}
                />
              </View>
            </View>

            {/* Selling Price & Status */}
            <View style={styles.row}>
              <View style={styles.halfCol}>
                <Text style={styles.label}>Selling Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                  value={form.selling_price}
                  onChangeText={(t) => handleChange("selling_price", t)}
                />
              </View>
              <View style={styles.halfCol}>
                <Text style={styles.label}>Status</Text>
                <TouchableOpacity
                  style={[
                    styles.statusBtn,
                    {
                      backgroundColor:
                        form.status === "active" ? "#ecfdf5" : "#fef2f2",
                      borderColor:
                        form.status === "active" ? "#a7f3d0" : "#fecaca",
                    },
                  ]}
                  onPress={() =>
                    handleChange(
                      "status",
                      form.status === "active" ? "inactive" : "active"
                    )
                  }
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: form.status === "active" ? "#059669" : "#dc2626",
                    }}
                  >
                    {form.status === "active" ? "Active" : "Inactive"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.formBtnRow}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                <Text style={styles.saveBtnText}>Save Item</Text>
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

        {/* Inventory Table - hidden when form is open */}
        {!showForm && (
          items.length === 0 ? (
            <EmptyState
              title="No Items"
              message="Inventory items will appear here once added."
            />
          ) : (
            <ScrollView horizontal style={styles.tableWrap}>
              <View>
                <TableHeader
                  columns={[
                    { key: "name", label: "Item Name", width: 130 },
                    { key: "code", label: "Code", width: 100 },
                    { key: "category", label: "Category", width: 110 },
                    { key: "unit", label: "Unit", width: 80 },
                    { key: "stock", label: "Stock", width: 80 },
                    { key: "reorder", label: "Reorder", width: 80 },
                    { key: "status", label: "Status", width: 100 },
                    { key: "actions", label: "Actions", width: 90 },
                  ]}
                />
                {items.map((item) => (
                  <TableRow
                    key={item.id}
                    cells={[
                      { key: "name", value: item.name, width: 130, align: "left" },
                      { key: "code", value: item.code, width: 100 },
                      { key: "category", value: item.category, width: 110 },
                      { key: "unit", value: item.unit, width: 80 },
                      { key: "stock", value: String(item.stock), width: 80 },
                      { key: "reorder", value: String(item.reorder_level), width: 80 },
                      { key: "status", value: item.status, width: 100 },
                      {
                        key: "actions",
                        value: "",
                        width: 90,
                        render: () => (
                          <View style={styles.actionsCell}>
                            <TouchableOpacity
                style={{marginRight: 12}}
                onPress={() => navigation.navigate("EditInventory", { item })}>
                <MaterialIcons name="edit" size={20} color={colors.primary} />
              </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete" size={20} color={colors.primary} />
              </TouchableOpacity>
                          </View>
                        ),
                      },
                    ]}
                  />
                ))}
              </View>
            </ScrollView>
          )
        )}
        {/* Category Modal */}
        <Modal
          visible={showCategoryModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Category</Text>
                <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                  <Ionicons name="close" size={22} color="#6b7280" />
                </TouchableOpacity>
              </View>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.modalOption,
                    form.category === cat && styles.modalOptionActive,
                    
                  ]}
                  onPress={() => {
                    if (cat === "Others") {
                      setShowNewCategoryInput(true);
                    }else{
                    handleChange("category", cat);
                    setShowCategoryModal(false);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      form.category === cat && styles.modalOptionTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                  {form.category === cat && (
                    <Ionicons name="checkmark" size={18} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              ))}
              {showNewCategoryInput && (
  <View style={{ padding: 15 }}>
    <TextInput
      placeholder="Enter new category"
      style={styles.input}
      value={newCategory}
      onChangeText={setNewCategory}
    />

    <TouchableOpacity
      style={styles.saveBtn}
      
      
      onPress={() => {

        if (!newCategory.trim()) {
          Alert.alert("Validation", "Enter category name");
          return;
        }

        // add category to dropdown
        setCategories([...categories, newCategory]);

        // select that category
        handleChange("category", newCategory);

        // reset
        setNewCategory("");
        setShowNewCategoryInput(false);
        setShowCategoryModal(false);
      }}
    ><Text style={[ styles.saveBtnText]}>Save Category</Text>
                  {/* <Text style={styles.saveBtnText}>Add Category</Text> */}
    </TouchableOpacity>
  </View>
)}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default AddItemScreen;

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
    backgroundColor: "#CB0C9F",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
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
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  halfCol: {
    flex: 1,
  },
  label: {
    marginBottom: 4,
    fontWeight: "600",
    fontSize: 12,
    color: "#374151",
  },
  required: {
    color: "#ef4444",
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
  statusBtn: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
  },
  formBtnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#CB0C9F",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
   saveBtn2: {
    //flex: 1,
    //backgroundColor: "#11010f",
   // paddingVertical: 12,
    //borderRadius: 6,
    alignItems: "center",
    color:"#11010f",
    flex:0,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
    
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 6,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 13,
  },

  /* Table */
  tableWrap: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  actionsCell: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 10,
    width: "80%",
    maxHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalOptionActive: {
    backgroundColor: "#eff6ff",
  },
  modalOptionText: {
    fontSize: 14,
    color: "#374151",
  },
  modalOptionTextActive: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
