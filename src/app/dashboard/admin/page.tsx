import styles from "../dashboard.module.css";
import { prisma } from "@/lib/prisma";
import VendorManagementTable from "./vendors/VendorManagementTable";

export default async function AdminDashboard() {
  const totalVendors = await prisma.vendorProfile.count();
  const pendingApprovals = await prisma.vendorProfile.count({
    where: { status: "PENDING" }
  });
  const totalCustomers = await prisma.user.count({
    where: { role: "CUSTOMER" }
  });

  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["PAID", "SHIPPED", "DELIVERED"] }
    }
  });
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Fetch all vendors to display in the management table
  const allVendors = await prisma.vendorProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } } }
  });

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: "2rem", fontSize: "1.5rem", fontWeight: "600" }}>Super Admin Overview</h1>
      
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <h3>Total Platform Revenue</h3>
          <p>${totalRevenue.toFixed(2)}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Vendors</h3>
          <p>{totalVendors}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Pending Approvals</h3>
          <p>{pendingApprovals}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Customers</h3>
          <p>{totalCustomers}</p>
        </div>
      </div>

      <div className="card" style={{ padding: "1.5rem", marginTop: "2rem" }}>
        <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem", fontWeight: "600" }}>Vendor Management</h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
          View and control all registered vendors, change their status, and adjust their commission rates directly.
        </p>
        <VendorManagementTable initialVendors={allVendors} />
      </div>
    </div>
  );
}
