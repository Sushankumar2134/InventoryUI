import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks";

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
  const { colors, sizes } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.light,
        },
      ]}
      activeOpacity={0.8}
      onPress={onPress}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: colors.light },
        ]}>
        <Ionicons name={iconName} size={24} color={colors.black} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default DashboardCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    marginHorizontal: 6,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
  },
});
