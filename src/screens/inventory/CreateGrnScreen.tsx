import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../../services/api";

const CreateGrnScreen: React.FC = () => {
    // console.log("THIS IS NEW CreateGrnScreen");
  const navigation = useNavigation<any>();

  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchApprovedPOs();
  }, []);

  const fetchApprovedPOs = async () => {
    try {
      const response = await api.get(
        "/inventory/purchase-orders/approved"
      );
      setPurchaseOrders(response.data);
    } catch (error) {
      console.log("Fetch Approved PO Error:", error);
    }
  };

//   const handleCreateGRN = async () => {
//     if (!selectedPO) {
//       Alert.alert("Validation", "Please select Purchase Order");
//       return;
//     }

//     try {
//       await api.post("/inventory/grns", {
//         purchase_order_id: selectedPO.id,
//         received_date: new Date().toISOString().split("T")[0],
//         items: selectedPO.items.map((item: any) => ({  
//           item_id: item.item_id,
//           ordered_quantity: item.quantity,
//           received_quantity: item.quantity,
//           unit_price: item.unit_price,
//         })),
//       });

//       Alert.alert("Success", "GRN Created Successfully");
//       navigation.goBack();
//     } catch (error: any) {
//       console.log("GRN Error:", error?.response?.data);
//       Alert.alert("Error", "Failed to create GRN");
//     }
//   };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create GRN</Text>

      {/* Custom Dropdown */}
      <Text style={styles.label}>Select Approved Purchase Order</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Text>
          {selectedPO
            ? `${selectedPO.po_number} - ${selectedPO.vendor?.vendor_name}`
            : "Tap to select PO"}
        </Text>
      </TouchableOpacity>

      {/* Modal List */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Approved Purchase Orders</Text>

            <FlatList
              data={purchaseOrders}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedPO(item);
                    setModalVisible(false);
                  }}
                >
                  <Text>
                    {item.po_number} - {item.vendor?.vendor_name}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeBtn}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {selectedPO && (
        <>
          {/* PO DETAILS */}
          <View style={styles.card}>
            <Text>PO Number: {selectedPO.po_number}</Text>
            <Text>Vendor: {selectedPO.vendor?.vendor_name}</Text>
            <Text>Status: {selectedPO.status}</Text>
            <Text>Order Date: {selectedPO.order_date}</Text>
            <Text>Expected Date: {selectedPO.expected_date || "-"}</Text>
            <Text>Total Amount: ₹ {selectedPO.total_amount}</Text>
          </View>

          {/* ITEMS TABLE */}
          <Text style={styles.sectionTitle}>Items</Text>

          <View style={styles.tableHeader}>
            <Text style={styles.cell}>#</Text>
            <Text style={styles.cell}>Item</Text>
            <Text style={styles.cell}>Qty</Text>
            <Text style={styles.cell}>Total</Text>
          </View>

          {selectedPO.items?.map((item: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.cell}>{index + 1}</Text>
              <Text style={styles.cell}>{item.item?.name}</Text>
              <Text style={styles.cell}>{item.quantity}</Text>
              <Text style={styles.cell}>
                ₹ {item.quantity * item.unit_price}
              </Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.createBtn}
            onPress={() =>
    navigation.navigate("GrnEntryScreen", {
      purchaseOrder: selectedPO,
    })
  }
          >
            <Text style={styles.createBtnText}>CREATE GRN</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default CreateGrnScreen;

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
  label: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  dropdown: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e5e7eb",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  createBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 8,
    maxHeight: "70%",
  },
  modalTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeBtn: {
    backgroundColor: "#e11d48",
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    alignItems: "center",
  },
});