import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DashboardCardProps {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  iconName,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Ionicons name={iconName} size={24} color="#2c3e50" />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default DashboardCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
});
