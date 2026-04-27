import styles from "../dashboard.module.css";

export default function AdminDashboard() {
  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: "2rem", fontSize: "1.5rem", fontWeight: "600" }}>Super Admin Overview</h1>
      
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <h3>Total Platform Revenue</h3>
          <p>$0.00</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Vendors</h3>
          <p>0</p>
        </div>
        <div className={styles.statCard}>
          <h3>Pending Approvals</h3>
          <p>0</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Customers</h3>
          <p>0</p>
        </div>
      </div>

      <div className="card" style={{ padding: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem", fontWeight: "600" }}>Recent Registrations</h3>
        <p style={{ color: "var(--text-muted)" }}>No new vendor registrations.</p>
      </div>
    </div>
  );
}
