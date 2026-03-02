import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { InventoryStackParamList } from "../../navigation/InventoryStack";
import api from "../../services/api";

type NavigationProp = StackNavigationProp<InventoryStackParamList>;

interface Item {
  id: number;
  name: string;
  code: string;
}

const InventoryListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get("/inventory/items");
      setItems(res.data.data || []);
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.name}</Text>

            {/* TEST EDIT BUTTON */}
            {/* <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                console.log("EDIT PRESSED");
                //navigation.navigate("EditInventory", { item });
              }}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
            </TouchableOpacity> */}
          </View>
        )}
      />
      <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                console.log("EDIT PRESSED");
                //navigation.navigate("EditInventory", { item });
              }}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
            </TouchableOpacity> 
    </View>
  );
};

export default InventoryListScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  editBtn: {
    backgroundColor: "orange",
    padding: 8,
    borderRadius: 4,
  },
});