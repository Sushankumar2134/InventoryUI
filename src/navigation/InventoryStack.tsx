import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import InventoryDashboardScreen from "../screens/inventory/InventoryDashboardScreen";
import PurchaseOrderScreen from "../screens/inventory/PurchaseOrderScreen";
import GRNScreen from "../screens/inventory/GRNScreen";
import StockTransferScreen from "../screens/inventory/StockTransferScreen";
import StockAuditScreen from "../screens/inventory/StockAuditScreen";
import ReportsScreen from "../screens/inventory/ReportsScreen";
import AddItemScreen from "../screens/inventory/AddItemScreen";

export type InventoryStackParamList = {
  InventoryDashboardScreen: undefined;
  PurchaseOrderScreen: undefined;
  GRNScreen: undefined;
  StockTransferScreen: undefined;
  StockAuditScreen: undefined;
  ReportsScreen: undefined;
  AddItemScreen: undefined;
};

const Stack = createStackNavigator<InventoryStackParamList>();

const InventoryStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="InventoryDashboardScreen">
      <Stack.Screen
        name="InventoryDashboardScreen"
        component={InventoryDashboardScreen}
        options={{ title: "Inventory" }}
      />
      <Stack.Screen
        name="AddItemScreen"
        component={AddItemScreen}
        options={{ title: "Add Item" }}
      />
      <Stack.Screen
        name="PurchaseOrderScreen"
        component={PurchaseOrderScreen}
        options={{ title: "Purchase Orders" }}
      />
      <Stack.Screen
        name="GRNScreen"
        component={GRNScreen}
        options={{ title: "GRN List" }}
      />
      <Stack.Screen
        name="StockTransferScreen"
        component={StockTransferScreen}
        options={{ title: "Stock Transfers" }}
      />
      <Stack.Screen
        name="StockAuditScreen"
        component={StockAuditScreen}
        options={{ title: "Stock Audit" }}
      />
      <Stack.Screen
        name="ReportsScreen"
        component={ReportsScreen}
        options={{ title: "Reports" }}
      />
    </Stack.Navigator>
  );
};

export default InventoryStack;
