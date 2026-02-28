import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface EmptyStateProps {
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  message: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
});
