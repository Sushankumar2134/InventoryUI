// src/screens/inventory/InventoryListScreen.tsx

import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";
import api from "../../services/api";


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

type NavigationProp = StackNavigationProp<RootStackParamList>;

const InventoryListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [search, setSearch] = useState("");

  const [items, setItems] = useState<InventoryItem[]>([]);
    // {
    //   id: 1,
    //   name: "Paracetamol",
    //   code: "MED001",
    //   category: "Medicine",
    //   unit: "Tablets",
    //   stock: 5,
    //   reorder_level: 10,
    //   status: "active",
    // },
    // {
    //   id: 2,
    //   name: "Akarsh",
    //   code: "MED002",
    //   category: "Medicine",
    //   unit: "Bottles",
    //   stock: 7,
    //   reorder_level: 10,
    //   status: "active",
    // },
 
useEffect(() => {
  fetchItems();
}, []);

const fetchItems = async () => {
  try {
    const response = await api.get("/inventory/items");
    console.log("API Response:", response.data);
    setItems(response.data);
  } catch (error) {
    console.error("Error fetching items:", error);
    setItems([]);
  }
};

  const renderItem = ({ item }: { item: InventoryItem }) => (
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
      <View style={[styles.statusBadge, item.status === "active" ? styles.activeStatus : styles.inactiveStatus]}>
        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
      </View>
      <View style={styles.cellActions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate("EditInventory", { item })}
        >
          <Text style={styles.btnTextSmall}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() =>
            navigation.navigate("DeleteInventory", { itemId: item.id })
          }
        >
          <Text style={styles.btnTextSmall}>Del</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Items</Text>

      <TextInput
        placeholder="Search by name or code"
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      {/* Horizontally Scrollable Table */}
      <ScrollView horizontal style={styles.tableWrapper}>
        <View>
          {/* Table Header */}
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

          {/* Table Rows */}
          {
          /* <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
          /> */
          <FlatList<InventoryItem>
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false}/>
          
          }

        </View>
      </ScrollView> 

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddItemScreen")}
      >
        <Text style={styles.btnText}>+ ADD ITEM</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InventoryListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f4f6f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  search: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableWrapper: {
    flex: 1,
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
    paddingVertical: 15,
    paddingHorizontal: 12,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
  },
  cellId: { width: 100, paddingVertical: 12, paddingHorizontal: 12, textAlign: "center", fontWeight: "600" },
  cellName: { width: 100, paddingVertical: 12, paddingHorizontal: 12, fontWeight: "600", fontSize: 13 },
  cellCode: { width: 100, paddingVertical: 12, paddingHorizontal: 12, fontSize: 12 },
  cellCategory: { width: 100, paddingVertical: 12, paddingHorizontal: 12, fontSize: 12 },
  cellUnit: { width: 100, paddingVertical: 12, paddingHorizontal: 12, fontSize: 12 },
  cellStock: { width: 100, paddingVertical: 12, paddingHorizontal: 12, fontWeight: "bold", fontSize: 13, textAlign: "center" },
  cellReorder: { width: 100, paddingVertical: 12, paddingHorizontal: 12, textAlign: "center", fontSize: 12 },
  statusBadge: { width: 100, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 4, alignItems: "center" },
  activeStatus: { backgroundColor: "#4caf50" },
  inactiveStatus: { backgroundColor: "#f44336" },
  statusText: { color: "#fff", fontWeight: "bold", fontSize: 11 },
  lowStock: { color: "#f44336" },
  normalStock: { color: "#4caf50" },
  cellActions: { width: 100, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5, paddingVertical: 10, paddingHorizontal: 5 },
  editBtn: {
    backgroundColor: "#ff9800",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  deleteBtn: {
    backgroundColor: "#f44336",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  btnTextSmall: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  addBtn: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});