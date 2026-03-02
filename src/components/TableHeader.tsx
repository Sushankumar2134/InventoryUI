import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TableColumn {
  key: string;
  label: string;
  width?: number;
}

interface TableHeaderProps {
  columns: TableColumn[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ columns }) => {
  return (
    <View style={styles.headerRow}>
      {columns.map((col) => (
        <Text
          key={col.key}
          style={[styles.headerCell, col.width ? { width: col.width } : null]}
        >
          {col.label}
        </Text>
      ))}
    </View>
  );
};

export default TableHeader;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#365f91",
    borderBottomWidth: 2,
    borderBottomColor: "#1f2a44",
  },
  headerCell: {
    width: 120,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
    textAlign: "center",
  },
});
