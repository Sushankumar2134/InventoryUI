import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/types";

type Props = StackScreenProps<RootStackParamList, "DeleteInventory">;

const InventoryDelete: React.FC<Props> = ({ route, navigation }) => {
  const { itemId } = route.params;

  const handleDelete = () => {
    Alert.alert("Deleted", `Item ${itemId} deleted`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Item?</Text>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={{ color: "#fff" }}>Confirm Delete</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ marginTop: 15 }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InventoryDelete;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, marginBottom: 20 },
  deleteBtn: {
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 6,
  },
});
