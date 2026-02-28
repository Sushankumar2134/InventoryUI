import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TableCell {
  key: string;
  value: string | number;
  width?: number;
  align?: "left" | "center" | "right";
  render?: () => React.ReactNode;
}

interface TableRowProps {
  cells: TableCell[];
}

const TableRow: React.FC<TableRowProps> = ({ cells }) => {
  return (
    <View style={styles.row}>
      {cells.map((cell) =>
        cell.render ? (
          <View
            key={cell.key}
            style={[
              styles.customCell,
              cell.width ? { width: cell.width } : null,
            ]}
          >
            {cell.render()}
          </View>
        ) : (
          <Text
            key={cell.key}
            style={[
              styles.cell,
              cell.width ? { width: cell.width } : null,
              cell.align ? { textAlign: cell.align } : null,
            ]}
          >
            {cell.value}
          </Text>
        )
      )}
    </View>
  );
};

export default TableRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    alignItems: "center",
  },
  cell: {
    width: 120,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 12,
    color: "#1f2937",
    textAlign: "center",
  },
  customCell: {
    width: 120,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
