import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { getInventoryReports } from "../../services/inventoryService";
import type { InventoryReport } from "../../types/inventoryTypes";
import TableHeader from "../../components/TableHeader";
import TableRow from "../../components/TableRow";
import EmptyState from "../../components/EmptyState";

const ReportsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<InventoryReport | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getInventoryReports();
      setReport(data);
      setLoading(false);
    };

    void load();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Inventory Reports</Text>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : !report ? (
        <EmptyState title="No Reports" message="Reports will appear here." />
      ) : (
        <>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Items</Text>
              <Text style={styles.summaryValue}>{report.summary.total_items}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Low Stock Items</Text>
              <Text style={styles.summaryValue}>{report.summary.low_stock_items}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Purchase Orders</Text>
              <Text style={styles.summaryValue}>{report.summary.total_purchase_orders}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Stock Value</Text>
              <Text style={styles.summaryValue}>{report.summary.total_stock_value}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Recent Purchase Orders</Text>
          {report.recent_purchase_orders.length === 0 ? (
            <EmptyState title="No Purchase Orders" message="No recent purchase orders." />
          ) : (
            <ScrollView horizontal style={styles.tableWrap}>
              <View>
                <TableHeader
                  columns={[
                    { key: "po", label: "PO Number", width: 120 },
                    { key: "vendor", label: "Vendor", width: 160 },
                    { key: "date", label: "Order Date", width: 120 },
                    { key: "total", label: "Total", width: 120 },
                    { key: "status", label: "Status", width: 120 },
                  ]}
                />
                {report.recent_purchase_orders.map((item) => (
                  <TableRow
                    key={item.id}
                    cells={[
                      { key: "po", value: item.po_number, width: 120 },
                      { key: "vendor", value: item.vendor_name, width: 160, align: "left" },
                      { key: "date", value: item.order_date, width: 120 },
                      { key: "total", value: item.total_amount, width: 120 },
                      { key: "status", value: item.status, width: 120 },
                    ]}
                  />
                ))}
              </View>
            </ScrollView>
          )}

          <Text style={styles.sectionTitle}>Recent GRNs</Text>
          {report.recent_grns.length === 0 ? (
            <EmptyState title="No GRNs" message="No recent GRNs." />
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
                {report.recent_grns.map((item) => (
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
        </>
      )}
    </ScrollView>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  loading: {
    color: "#6b7280",
    fontSize: 12,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  tableWrap: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
});
