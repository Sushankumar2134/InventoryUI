// src/screens/inventory/StockTransferListScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const StockTransferListScreen = () => {
  const navigation = useNavigation();

  // 🔥 Later fetch from Laravel API
  const [transfers] = useState([
    {
      id: 1,
      transfer_number: "TR-001",
      transfer_date: "2026-02-27",
    },
  ]);

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