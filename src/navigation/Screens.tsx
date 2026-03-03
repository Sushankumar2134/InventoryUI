import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Articles, Components, Home, Profile, Register, Pro, } from '../screens';
import {useScreenOptions, useTranslation} from '../hooks';

import InventoryDashboardScreen from "../screens/inventory/InventoryDashboardScreen";
import InventoryListScreen from "../screens/inventory/InventoryListScreen";
import AddItemScreen from "../screens/inventory/AddItemScreen";
import EditInventory from "../screens/inventory/EditInventory";
import InventoryDelete from "../screens/inventory/inventoryDelete";
import Dashboard from "../screens/Dashboard";
import PurchaseOrderScreen from "../screens/inventory/PurchaseOrderScreen";
import PurchaseOrderViewScreen from "../screens/inventory/PurchaseOrderViewScreen";
import GRNScreen from "../screens/inventory/GRNScreen";
import StockTransferScreen from "../screens/inventory/StockTransferScreen";
import StockAuditScreen from "../screens/inventory/StockAuditScreen";
import ReportsScreen from "../screens/inventory/ReportsScreen";
import {RootStackParamList} from './types';
import PurchaseOrderEditScreen from '../screens/inventory/PurchaseOrderEditScreen';
import CreateGrnScreen from '../screens/inventory/CreateGrnScreen';
import GrnEntryScreen from '../screens/inventory/GrnEntryScreen';

const Stack = createStackNavigator<RootStackParamList & Record<string, any>>();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: t('navigation.home')}}
      />
      <Stack.Screen
        name="AddItemScreen"
        component={AddItemScreen}
        options={{ title: "Add Item" }}
      />
       <Stack.Screen
        name="CreateGrnScreen"
        component={CreateGrnScreen}
        options={{ title: "Create GRN" }}
         />

        <Stack.Screen
         name="GrnEntryScreen"
          component={GrnEntryScreen}
          options={{ title: "Create GRN Entry" }}
          /> 
      <Stack.Screen
        name="EditInventory"
        component={EditInventory}
        options={{ title: "Edit Item" }}
      />

      <Stack.Screen
        name="DeleteInventory"
        component={InventoryDelete}
        options={{ title: "Delete Item" }}
      />

      <Stack.Screen
        name="PurchaseOrderScreen"
        component={PurchaseOrderScreen}
        options={{ title: "Purchase Orders" }}
      />

      <Stack.Screen
        name="PurchaseOrderViewScreen"
        component={PurchaseOrderViewScreen}
        options={{ title: "Purchase Order Details" }}
      />
       <Stack.Screen
  name="PurchaseOrderEditScreen"
  component={PurchaseOrderEditScreen}
  options={{ title: "Edit Purchase Order" }}
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

      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: "Dashboard" }}
      />

      <Stack.Screen
        name="InventoryDashboardScreen"
        component={InventoryDashboardScreen}
        options={{ title: "Inventory Dashboard" }}
      />

      <Stack.Screen
        name="InventoryListScreen"
        component={InventoryListScreen}
        options={{ title: "Inventory Items" }}
      />

      <Stack.Screen
        name="Components"
        component={Components}
        options={screenOptions.components}
      />

      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{title: t('navigation.articles')}}
      />

      <Stack.Screen name="Pro" component={Pro} options={screenOptions.pro} />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};