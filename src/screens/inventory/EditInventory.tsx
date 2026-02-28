// src/screens/inventory/EditInventory.tsx

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
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";

type EditInventoryProps = {
  route: RouteProp<RootStackParamList, "EditInventory">;
};

const EditInventory: React.FC<EditInventoryProps> = ({ route }) => {
  const { item } = route.params;

  const [form, setForm] = useState({ ...item });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleUpdate = () => {
    Alert.alert("Updated", "Item Updated (API integration later)");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Item</Text>

      {Object.keys(form).map((key) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.label}>{key.replace("_", " ")}</Text>
          <TextInput
            style={styles.input}
            value={String((form as any)[key])}
            onChangeText={(text) => handleChange(key, text)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
        <Text style={styles.btnText}>Update Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditInventory;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f6f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  label: { marginBottom: 5, fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
  },
  saveBtn: {
    backgroundColor: "#ffc107",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: { color: "#000", fontWeight: "bold" },
});