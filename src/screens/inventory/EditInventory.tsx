// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import api from "../../services/api";

// export default function EditInventory({ route, navigation }: any) {
//   const { item } = route.params;

//   const [form, setForm] = useState({
//     name: item.name || "",
//     code: item.code || "",
//     category: item.category || "",
//     unit: item.unit || "",
//     reorder_level: String(item.reorder_level || ""),
//     purchase_price: String(item.purchase_price || ""),
//     selling_price: String(item.selling_price || ""),
//     status: item.status || "",
//     stock: String(item.stock || ""),
//   });

//   const handleChange = (key: string, value: any) => {

//     setForm({ ...form, [key]: value });

//   };


//   const handleUpdate = async () => {

//     try {

//       console.log("39",form);
//       await api.put(`/inventory/items/${item.id}`, form);
//       Alert.alert("Success", "Item Updated Successfully");
//       navigation.goBack();
//     } catch (error) {
//       Alert.alert("Error", "Update Failed");
//       console.log( error.response.data);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Edit Item</Text>

//       {/* Name & Code */}
//       <View style={styles.row}>
//         <View style={styles.halfCol}>
//           <Text style={styles.label}>Item Name</Text>
//           <TextInput
//             style={styles.input}
//             value={form.name}
//             onChangeText={(v) => handleChange("name", v)}
//             placeholder="Enter item name"
//           />
//         </View>
//         <View style={styles.halfCol}>
//           <Text style={styles.label}>Item Code</Text>
//           <TextInput
//             style={styles.input}
//             value={form.code}
//             onChangeText={(v) => handleChange("code", v)}
//             placeholder="e.g. MED001"
//           />
//         </View>
//       </View>

//       {/* Category & Unit & Reorder Level */}
//       <View style={styles.row}>
//         <View style={styles.halfCol}>
//           <Text style={styles.label}>Category</Text>
//           <TextInput
//             style={styles.input}
//             value={form.category}
//             onChangeText={(v) => handleChange("category", v)}
//             placeholder="Category"
//           />
//         </View>
//         <View style={styles.halfCol}>
//           <Text style={styles.label}>Unit</Text>
//           <TextInput
//             style={styles.input}
//             value={form.unit}
//             onChangeText={(v) => handleChange("unit", v)}
//             placeholder="Unit"
//           />
//         </View>
//         <View style={styles.halfCol}>
//           <Text style={styles.label}>Reorder Level</Text>
//           <TextInput
//             style={styles.input}
//             value={form.reorder_level}
//             onChangeText={(v) => handleChange("reorder_level", v)}
//             placeholder="Reorder Level"
//             keyboardType="numeric"
//           />
//         </View>
//       </View>

//       {/* Purchase Price, Selling Price, Status */}
//       <View style={styles.row}>
//         <View style={styles.halfCol}>
//           <Text style={styles.label}>Purchase Price</Text>
//           <TextInput
//             style={styles.input}
//             value={form.purchase_price}
//             onChangeText={(v) => handleChange("purchase_price", v)}
//             placeholder="Purchase Price"
//             keyboardType="decimal-pad"
//           />
//         </View>
//         <View style={styles.halfCol}>
//           <Text style={styles.label}>Selling Price</Text>
//           <TextInput
//             style={styles.input}
//             value={form.selling_price}
//             onChangeText={(v) => handleChange("selling_price", v)}
//             placeholder="Selling Price"
//             keyboardType="decimal-pad"
//           />
//         </View>
//         <View style={styles.halfCol}>
//           <Text style={styles.label}>Status</Text>
//           <TextInput
//             style={styles.input}
//             value={form.status}
//             onChangeText={(v) => handleChange("status", v)}
//             placeholder="Status"
//           />
//         </View>
//       </View>

//       {/* Stock */}
//       <View style={styles.row}>
//         <View style={styles.halfCol}>
//           <Text style={styles.label}>Stock</Text>
//           <TextInput
//             style={styles.input}
//             value={form.stock}
//             onChangeText={(v) => handleChange("stock", v)}
//             placeholder="Stock"
//             keyboardType="numeric"
//           />
//         </View>
//       </View>

//       {/* Buttons */}
//       <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
//         <Text style={{ color: "#fff", fontWeight: "700" }}>UPDATE ITEM</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
//         <Text style={{ color: "#fff", fontWeight: "700" }}>CANCEL</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   title: { fontSize: 20, marginBottom: 20, fontWeight: "bold" },
//   row: { flexDirection: "row", gap: 10, marginBottom: 12 },
//   halfCol: { flex: 1 },
//   label: { marginBottom: 4, fontWeight: "600", fontSize: 12, color: "#374151" },
//   input: {
//     backgroundColor: "#f9fafb",
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     padding: 10,
//     borderRadius: 6,
//     fontSize: 13,
//     color: "#111827",
//     marginBottom: 10,
//   },
//   updateBtn: {
//     backgroundColor: "#22c55e",
//     padding: 15,
//     alignItems: "center",
//     borderRadius: 6,
//     marginTop: 10,
//   },
//   cancelBtn: {
//     backgroundColor: "#64748b",
//     padding: 15,
//     alignItems: "center",
//     borderRadius: 6,
//     marginTop: 10,
//   },
// });
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "../../services/api";

export default function EditInventory({ route, navigation }: any) {
  const { item } = route.params;

  const categories = ["Medicine", "Equipment", "Consumable", "Surgical", "Lab"];
  const statuses = ["active", "inactive"];
  const [form, setForm] = useState({
    name: item.name || "",
    code: item.code || "",
    category: item.category || categories[0],
    unit: item.unit || "",
    purchase_price: String(item.purchase_price || ""),
    selling_price: String(item.selling_price || ""),
    reorder_level: String(item.reorder_level || ""),
    current_stock: String(item.current_stock || ""),
    minimum_stock: String(item.minimum_stock || ""),
    status: item.status || statuses[0],
  });

  const handleChange = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/inventory/items/${item.id}`, form);
      Alert.alert("Success", "Item Updated Successfully");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", "Update Failed");
      console.log(error.response?.data);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Inventory Item</Text>

      {/* Name & Code */}
      <Text style={styles.label}>Item Name</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(v) => handleChange("name", v)}
        placeholder="Enter item name"
      />

      <Text style={styles.label}>Item Code</Text>
      <TextInput
        style={styles.input}
        value={form.code}
        onChangeText={(v) => handleChange("code", v)}
        placeholder="MED001"
      />

      {/* Category */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.dropdownWrap}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.dropdownOption, form.category === cat && styles.dropdownActive]}
            onPress={() => handleChange("category", cat)}
          >
            <Text style={[styles.dropdownText, form.category === cat && styles.dropdownTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Unit */}
      <Text style={styles.label}>Unit</Text>
      <TextInput
        style={styles.input}
        value={form.unit}
        onChangeText={(v) => handleChange("unit", v)}
        placeholder="Strip / Piece / Box"
      />

      {/* Prices */}
      <Text style={styles.label}>Purchase Price</Text>
      <TextInput
        style={styles.input}
        value={form.purchase_price}
        onChangeText={(v) => handleChange("purchase_price", v.replace(/[^0-9.]/g, ""))}
        keyboardType="numeric"
        placeholder="Purchase Price"
      />

      <Text style={styles.label}>Selling Price</Text>
      <TextInput
        style={styles.input}
        value={form.selling_price}
        onChangeText={(v) => handleChange("selling_price", v.replace(/[^0-9.]/g, ""))}
        keyboardType="numeric"
        placeholder="Selling Price"
      />

      {/* Stock Section */}
      <Text style={styles.label}>Reorder Level</Text>
      <TextInput
        style={styles.input}
        value={form.reorder_level}
        onChangeText={(v) => handleChange("reorder_level", v.replace(/[^0-9]/g, ""))}
        keyboardType="numeric"
        placeholder="Reorder Level"
      />

      <Text style={styles.label}>Current Stock</Text>
      <TextInput
        style={styles.input}
        value={form.current_stock}
        onChangeText={(v) => handleChange("current_stock", v.replace(/[^0-9]/g, ""))}
        keyboardType="numeric"
        placeholder="Current Stock"
      />

      <Text style={styles.label}>Minimum Stock</Text>
      <TextInput
        style={styles.input}
        value={form.minimum_stock}
        onChangeText={(v) => handleChange("minimum_stock", v.replace(/[^0-9]/g, ""))}
        keyboardType="numeric"
        placeholder="Minimum Stock"
      />

      {/* Status */}
      <Text style={styles.label}>Status</Text>
      <View style={styles.dropdownWrap}>
        {statuses.map((stat) => (
          <TouchableOpacity
            key={stat}
            style={[styles.dropdownOption, form.status === stat && styles.dropdownActive]}
            onPress={() => handleChange("status", stat)}
          >
            <Text style={[styles.dropdownText, form.status === stat && styles.dropdownTextActive]}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
        <Text style={styles.btnText}>UPDATE ITEM</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.btnText}>CANCEL</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    dropdownWrap: {
      flexDirection: "row",
      marginBottom: 15,
      flexWrap: "wrap",
      gap: 8,
    },
    dropdownOption: {
      backgroundColor: "#f3f4f6",
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginRight: 8,
      marginBottom: 4,
    },
    dropdownActive: {
      backgroundColor: "#eff6ff",
      borderColor: "#3b82f6",
    },
    dropdownText: {
      color: "#374151",
      fontSize: 13,
    },
    dropdownTextActive: {
      color: "#2563eb",
      fontWeight: "700",
    },
  container: { flex: 1, padding: 20, backgroundColor: "#f3f4f6" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
  },
  label: {
    marginBottom: 5,
    fontWeight: "600",
    fontSize: 13,
    color: "#374151",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  updateBtn: {
    backgroundColor: "#16a34a",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  cancelBtn: {
    backgroundColor: "#6b7280",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "700" },
});