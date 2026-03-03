import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { InventoryStackParamList } from "../../navigation/InventoryStack";
import api from "../../services/api";

type EditRouteProp = RouteProp<
  InventoryStackParamList,
  "PurchaseOrderEditScreen"
>;

type NavigationProp = StackNavigationProp<
  InventoryStackParamList,
  "PurchaseOrderEditScreen"
>;

const PurchaseOrderEditScreen: React.FC = () => {
  const route = useRoute<EditRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { purchaseOrder } = route.params;

  const [poNumber, setPoNumber] = useState("");
  const [vendorId, setVendorId] = useState<number | null>(null);
  const [vendorName, setVendorName] = useState("");
  const [vendors, setVendors] = useState<any[]>([]);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState("");

  // Load vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get("/vendors");
        setVendors(response.data);
      } catch (error) {
        console.log("Vendor fetch error:", error);
      }
    };

    fetchVendors();
  }, []);

  // Load purchase order data AFTER vendors loaded
  useEffect(() => {
    if (purchaseOrder) {
      setPoNumber(purchaseOrder.po_number);
      const id = purchaseOrder.vendor_id || purchaseOrder.vendor?.id;
      setVendorId(id);
      setTotalAmount(String(purchaseOrder.total_amount));
    }
  }, [purchaseOrder]);

  // Sync vendorName when vendorId changes
  useEffect(() => {
    if (vendorId && vendors.length > 0) {
      const selected = vendors.find(v => v.id === vendorId);
      if (selected) {
        setVendorName(selected.vendor_name);
      }
    }
  }, [vendorId, vendors]);

  const handleUpdate = async () => {
    if (!vendorId) {
      Alert.alert("Validation", "Please select a supplier");
      return;
    }

    try {
      await api.put(
        `/inventory/purchase-orders/${purchaseOrder.id}`,
        {
          po_number: poNumber,
          vendor_id: vendorId,
          order_date: purchaseOrder.order_date,
          total_amount: totalAmount,
          items: purchaseOrder.items.map((item: any) => ({
            item_id: item.item_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
        }
      );

      Alert.alert("Success", "Purchase Order Updated Successfully");
      navigation.goBack();

    } catch (error: any) {
      console.log("Update Error:", error?.response?.data);
      Alert.alert("Error", "Update failed.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Edit Purchase Order</Text>

        {/* PO Number */}
        <Text style={styles.label}>PO Number</Text>
        <TextInput
          style={styles.input}
          value={poNumber}
          onChangeText={setPoNumber}
        />

        {/* Supplier */}
        <Text style={styles.label}>Supplier</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowVendorModal(true)}
        >
          <Text>{vendorName || "Select Supplier"}</Text>
        </TouchableOpacity>

        {/* Total Amount */}
        <Text style={styles.label}>Total Amount</Text>
        <TextInput
          style={styles.input}
          value={totalAmount}
          onChangeText={setTotalAmount}
          keyboardType="numeric"
        />

        {/* Update Button */}
        <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
          <Text style={styles.btnText}>UPDATE</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Vendor Modal */}
      {showVendorModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {vendors.map((vendor) => (
                <TouchableOpacity
                  key={vendor.id}
                  style={styles.modalItem}
                  onPress={() => {
                    setVendorId(vendor.id);
                    setShowVendorModal(false);
                  }}
                >
                  <Text>{vendor.vendor_name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowVendorModal(false)}
              style={{ marginTop: 15, alignItems: "center" }}
            >
              <Text style={{ color: "red", fontWeight: "bold" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default PurchaseOrderEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#e81167",
    padding: 14,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    elevation: 10,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    maxHeight: 400,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});