import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { InventoryStackParamList } from "../../navigation/InventoryStack";

type ViewScreenRouteProp = RouteProp<
  InventoryStackParamList,
  "PurchaseOrderViewScreen"
>;

type ViewScreenNavigationProp = StackNavigationProp<
  InventoryStackParamList,
  "PurchaseOrderViewScreen"
>;

type Props = {
  route: ViewScreenRouteProp;
};

const PurchaseOrderViewScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<ViewScreenNavigationProp>();
  const { purchaseOrder } = route.params;

  return (
    <ScrollView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Purchase Order Details</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>BACK</Text>
        </TouchableOpacity>
      </View>

      {/* PO Info */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>PO Number:</Text>
            <Text>{purchaseOrder.poNumber}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Vendor:</Text>
            <Text>{purchaseOrder.vendor}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Order Date:</Text>
            <Text>{purchaseOrder.orderDate}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Expected Date:</Text>
            <Text>{purchaseOrder.expectedDate}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Status:</Text>
            <Text>{purchaseOrder.status}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text>₹ {purchaseOrder.totalAmount}</Text>
          </View>
        </View>
      </View>

      {/* Items Section */}
      <Text style={styles.sectionTitle}>Items</Text>

      <View style={styles.tableHeader}>
        <Text style={styles.cell}>#</Text>
        <Text style={styles.cell}>Item</Text>
        <Text style={styles.cell}>Qty</Text>
        <Text style={styles.cell}>Unit</Text>
        <Text style={styles.cell}>Total</Text>
      </View>

      {purchaseOrder.items.length === 0 ? (
        <Text style={{ padding: 10 }}>No Items</Text>
      ) : (
        purchaseOrder.items.map((item: any, index: number) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>₹ {item.unitPrice}</Text>
            <Text style={styles.cell}>₹ {item.total}</Text>
          </View>
        ))
      )}

      {/* Approve Button */}
      <TouchableOpacity style={styles.approveBtn}>
        <Text style={styles.approveText}>APPROVE PURCHASE ORDER</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default PurchaseOrderViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backBtn: {
    backgroundColor: "#64748b",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  col: {
    flex: 1,
  },
  label: {
    fontWeight: "bold",
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
  approveBtn: {
    backgroundColor: "#16a34a",
    padding: 14,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  approveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});