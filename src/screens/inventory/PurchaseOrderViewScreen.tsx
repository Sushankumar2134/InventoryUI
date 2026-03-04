
import React,{useEffect,} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { InventoryStackParamList } from "../../navigation/InventoryStack";
import api from "../../services/api";
import PurchaseOrderEditScreen from "./PurchaseOrderEditScreen";



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

//   const handleApprove = () => {
//     Alert.alert(
//       "Approve Purchase Order",
//       "Are you sure you want to approve this purchase order?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "OK",
//           onPress: async () => {
//             try {
//               // Approve in backend
//               await api.put(
//                 `/inventory/purchase-orders/${purchaseOrder.id}/approve`
//               );

//             //   // Fetch updated PO
//             //   const response = await api.get(
//             //     `/inventory/purchase-orders/${purchaseOrder.id}`
//             //   );

//               // Reload details screen
//               navigation.replace("PurchaseOrderViewScreen", {
//                 purchaseOrder: response.data,
//               });
//             } catch (error) {
//               Alert.alert("Error", "Approval failed");
//             }
//           },
//         },
//       ]
//     );
//   };
// const handleApprove = () => {
//   // If already approved → go directly to GRN
//   if (purchaseOrder.status === "approved") {
//     navigation.navigate("CreateGrnScreen", {
//       purchaseOrder,
//     });
//     return;
//   }

//   Alert.alert(
//     "Approve Purchase Order",
//     "Are you sure you want to approve this purchase order?",
//     [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "OK",
//         onPress: async () => {
//           try {
//             // Approve PO
//             await api.put(
//               `/inventory/purchase-orders/${purchaseOrder.id}/approve`
//             );

//             // Get updated PO
//             const response = await api.get(
//               `/inventory/purchase-orders/${purchaseOrder.id}`
//             );

//             console.log("Approved PO:", response.data);

//             // Navigate to GRN screen
//             navigation.navigate("CreateGrnScreen", {
//               purchaseOrder: response.data,
//             });

//           } catch (error: any) {
//             console.log("Approval Error:", error?.response?.data);
//             Alert.alert("Error", "Approval failed");
//           }
//         },
//       },
//     ]
//   );
// };
const handleApprove = () => {
  if (purchaseOrder.status === "approved") {
    return; // do nothing if already approved
  }

  Alert.alert(
    "Approve Purchase Order",
    "Are you sure you want to approve this purchase order?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          try {
            // 1️⃣ Approve in backend
            await api.put(
              `/inventory/purchase-orders/${purchaseOrder.id}/approve`
            );

            // 2️⃣ Fetch updated PO
            const response = await api.get(
              `/inventory/purchase-orders/${purchaseOrder.id}`
            );

            // 3️⃣ Reload SAME screen with updated data
            navigation.navigate("PurchaseOrderViewScreen", {
              purchaseOrder: response.data,
            });

          } catch (error: any) {
            console.log("Approval Error:", error?.response?.data);
            Alert.alert("Error", "Approval failed");
          }
        },
      },
    ]
  );
};
  return (
    <ScrollView style={styles.container}>
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
            <Text>{purchaseOrder.po_number}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Vendor:</Text>
            <Text>{purchaseOrder.vendor?.vendor_name}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Order Date:</Text>
            <Text>{purchaseOrder.order_date}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Expected Date:</Text>
            <Text>{purchaseOrder.expected_date || "-"}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Status:</Text>
            <Text>{purchaseOrder.status}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text>₹ {purchaseOrder.total_amount}</Text>
          </View>
        </View>
      </View>

      {/* Items */}
      <Text style={styles.sectionTitle}>Items</Text>

      <View style={styles.tableHeader}>
        <Text style={styles.cell}>#</Text>
        <Text style={styles.cell}>Item</Text>
        <Text style={styles.cell}>Qty</Text>
        <Text style={styles.cell}>Unit</Text>
        <Text style={styles.cell}>Total</Text>
      </View>

      {purchaseOrder.items?.length === 0 ? (
        <Text style={{ padding: 10 }}>No Items</Text>
      ) : (
        purchaseOrder.items?.map((item: any, index: number) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cell}>{item.item?.name}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>₹ {item.unit_price}</Text>
            <Text style={styles.cell}>₹ {item.total}</Text>
          </View>
        ))
      )}

      {/* BUTTON LOGIC (UNCHANGED) */}
         
{purchaseOrder.status !== "approved" ? (

  // Approve Button (Visible only if NOT approved)
  <TouchableOpacity
    style={styles.approveBtn}
    onPress={handleApprove}
  >
    <Text style={styles.approveText}>
      APPROVE PURCHASE ORDER
    </Text>
  </TouchableOpacity>

) : (

  // Approved State (Disabled)
  <TouchableOpacity
    style={[styles.approveBtn, { backgroundColor: "#16a34a" }]}
    disabled
  >
    <Text style={styles.approveText}>
      APPROVED
    </Text>
  </TouchableOpacity>

)}
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
    backgroundColor: "#e81167ed",
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