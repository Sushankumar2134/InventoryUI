import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import DashboardCard from "../../components/DashboardCard";
import { useTheme } from "../../hooks";
import { Block, Text } from "../../components";
import type { RootStackParamList } from "../../navigation/types";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const InventoryDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, sizes, gradients } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}>
      <Block paddingHorizontal={sizes.padding}>
        <Text h4 bold color={colors.text} style={{ marginBottom: 4 }}>
          Inventory Dashboard
        </Text>
        <Text p color={colors.gray} style={{ marginBottom: sizes.sm }}>
          Hospital Inventory Management
        </Text>
      </Block>

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
  },
  content: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  grid: {
    flex: 1,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: "row",
  },
});
