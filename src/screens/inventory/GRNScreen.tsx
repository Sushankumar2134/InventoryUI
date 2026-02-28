import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import TableHeader from "../../components/TableHeader";
import TableRow from "../../components/TableRow";
import EmptyState from "../../components/EmptyState";
import { getGRNs } from "../../services/inventoryService";
import type { GRN } from "../../types/inventoryTypes";

const GRNScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [grns, setGrns] = useState<GRN[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getGRNs();
      setGrns(data);
      setLoading(false);
    };

    void load();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GRN List</Text>
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Create GRN</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : grns.length === 0 ? (
        <EmptyState title="No GRNs" message="GRNs will appear here once received." />
      ) : (
        <ScrollView horizontal style={styles.tableWrap}>
          <View>
            <TableHeader
              columns={[
                { key: "grn", label: "GRN Number", width: 140 },
                { key: "po", label: "PO Number", width: 120 },
                { key: "date", label: "Received Date", width: 140 },
                { key: "total", label: "Total", width: 120 },
              ]}
            />
            {grns.map((item) => (
              <TableRow
                key={item.id}
                cells={[
                  { key: "grn", value: item.grn_number, width: 140 },
                  { key: "po", value: item.po_number, width: 120 },
                  { key: "date", value: item.received_date, width: 140 },
                  { key: "total", value: item.total_amount, width: 120 },
                ]}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default GRNScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  primaryBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  loading: {
    color: "#6b7280",
    fontSize: 12,
  },
  tableWrap: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
});
