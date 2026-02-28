import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import DashboardCard from "../../components/DashboardCard";
import type { RootStackParamList } from "../../navigation/types";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const InventoryDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Inventory Dashboard</Text>
      <Text style={styles.subtitle}>Hospital Inventory Management</Text>

      <View style={styles.grid}>
        <View style={styles.row}>
          <DashboardCard
            title="Add Item"
            iconName="add-circle"
            onPress={() => navigation.navigate("AddItemScreen")}
          />
          <DashboardCard
            title="Purchase Orders"
            iconName="document-text"
            onPress={() => navigation.navigate("PurchaseOrderScreen")}
          />
        </View>
        <View style={styles.row}>
          <DashboardCard
            title="GRN List"
            iconName="clipboard"
            onPress={() => navigation.navigate("GRNScreen")}
          />
          <DashboardCard
            title="Stock Transfer"
            iconName="swap-horizontal"
            onPress={() => navigation.navigate("StockTransferScreen")}
          />
        </View>
        <View style={styles.row}>
          <DashboardCard
            title="Stock Audit"
            iconName="checkmark-done"
            onPress={() => navigation.navigate("StockAuditScreen")}
          />
          <DashboardCard
            title="Reports"
            iconName="bar-chart"
            onPress={() => navigation.navigate("ReportsScreen")}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default InventoryDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 16,
  },
  grid: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
});
