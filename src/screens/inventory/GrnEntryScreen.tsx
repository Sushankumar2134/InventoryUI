import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../../services/api";

const GrnEntryScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { purchaseOrder } = route.params;

  const [receivedDate, setReceivedDate] = useState("");

  const [items, setItems] = useState(
    purchaseOrder.items.map((item: any) => ({
      ...item,
      received_quantity: "",
    }))
  );

  const handleQtyChange = (value: string, index: number) => {
    const updatedItems = [...items];
    const orderedQty = updatedItems[index].quantity;

    let qty = parseInt(value) || 0;

    if (qty > orderedQty) {
      Alert.alert(
        "Invalid Quantity",
        `Received quantity cannot exceed ordered quantity (${orderedQty})`
      );
      qty = orderedQty;
    }

    updatedItems[index].received_quantity = qty;
    setItems(updatedItems);
  };

//   const handleSave = async () => {
//     if (!receivedDate) {
//       Alert.alert("Validation", "Please enter received date");
//       return;
//     }

//     try {
//       await api.post("/inventory/grns", {
//         purchase_order_id: purchaseOrder.id,
//         received_date: receivedDate,
//         items: items.map((item: any) => ({
//           item_id: item.item_id,
//           ordered_quantity: item.quantity,
//           received_quantity: item.received_quantity,
//           unit_price: item.unit_price,
//         })),
//       });

//       Alert.alert("Success", "GRN Created Successfully");

//       navigation.replace("GRNScreen");

//     } catch (error: any) {
//         console.log("===full error object===");
//         console.log(error);
//         console.log("=== response ===");
//         console.log(error?.response);
//         console.log("=== response data ===");
//         console.log(error?.response?.data);
//         console.log("FULL ERROR:",error);
//         console.log("Status:",error?.response?.status);
//       console.log("GRN Error:", error?.response?.data);
//       Alert.alert("Error", "Failed to create GRN");
//     }
//   };
const handleSave = async () => {
  if (!receivedDate) {
    Alert.alert("Validation", "Please enter received date");
    return;
  }

  for (let item of items) {
    if (!item.received_quantity || item.received_quantity <= 0) {
      Alert.alert("Validation", "Enter valid received quantity");
      return;
    }
  }

  try {
    await api.post("/inventory/grns", {
      purchase_order_id: purchaseOrder.id,
      received_date: receivedDate,
      items: items.map((item: any) => ({
        item_id: item.item_id, // ✅ FIXED
        ordered_quantity: item.quantity,
        received_quantity: item.received_quantity,
        unit_price: item.unit_price,
      })),
    });

    Alert.alert("Success", "GRN Created Successfully");
    navigation.replace("GRNScreen");

  } catch (error: any) {
    console.log("STATUS:", error?.response?.status);
    console.log("DATA:", error?.response?.data);
    Alert.alert("Error", "Failed to create GRN");
  }
};
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create GRN</Text>

      <View style={styles.card}>
        <Text>PO Number: {purchaseOrder.po_number}</Text>
        <Text>Vendor: {purchaseOrder.vendor?.vendor_name}</Text>
        <Text>Order Date: {purchaseOrder.order_date}</Text>

        <Text style={{ marginTop: 10 }}>Received Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={receivedDate}
          onChangeText={setReceivedDate}
        />
      </View>

      <Text style={styles.sectionTitle}>Items</Text>

      {items.map((item: any, index: number) => (
        <View key={index} style={styles.itemCard}>
          <Text style={styles.itemName}>{item.item?.name}</Text>
          <Text>Ordered Qty: {item.quantity}</Text>
          <Text>Unit Price: ₹ {item.unit_price}</Text>

          <Text>Received Qty</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={item.received_quantity.toString()}
            onChangeText={(value) => handleQtyChange(value, index)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>SAVE GRN</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default GrnEntryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginTop: 5,
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },
  itemName: {
    fontWeight: "600",
    marginBottom: 4,
  },
  saveBtn: {
    backgroundColor: "#16a34a",
    padding: 14,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});