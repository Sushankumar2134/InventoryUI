// src/screens/inventory/StockTransferListScreen.tsx

import React, {useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getStockTransfers } from "../../services/inventoryService";


const StockTransferListScreen = () => {
const navigation = useNavigation();
const [transfers, setTransfers] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadTransfers = async () => {
    setLoading(true);
    const data = await getStockTransfers();
    setTransfers(data);
    setLoading(false);
  };

  loadTransfers();
}, []);
  // 🔥 Later fetch from Laravel API
 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Stock Transfers</Text>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() =>
            navigation.navigate("CreateStockTransferScreen" as never)
          }
        >
          <Text style={styles.btnText}>Create Transfer</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={transfers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Transfer No: {item.transfer_number}</Text>
            <Text>Date: {item.transfer_date}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default StockTransferListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f4f6f9" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  createBtn: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 6,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
  },
  btnText: { color: "#fff" },
});