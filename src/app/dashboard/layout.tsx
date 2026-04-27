import Link from "next/link";
import styles from "./dashboard.module.css";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || 'fallback_secret_for_development';
const key = new TextEncoder().encode(secretKey);

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  let role = "";
  if (token) {
    try {
      const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
      role = payload.role as string;
    } catch (e) {
      console.error("Auth error in layout:", e);
    }
  }
  
  return (
    <div className={styles.dashboardWrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/">
            <h2>AutoParts<span>Global</span></h2>
          </Link>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/dashboard" className={styles.navItem}>Overview</Link>
          
          {role === 'VENDOR' && (
            <>
              <Link href="/dashboard/vendor/products" className={styles.navItem}>My Products</Link>
              <Link href="/dashboard/vendor/orders" className={styles.navItem}>Manage Orders</Link>
            </>
          )}

          {role === 'SUPER_ADMIN' && (
            <>
              <Link href="/dashboard/admin/vendors" className={styles.navItem}>Vendors</Link>
              <Link href="/dashboard/admin/settings" className={styles.navItem}>Global Settings</Link>
            </>
          )}

          <Link href="/products" className={styles.navItem}>View Storefront</Link>
        </nav>
      </aside>
      
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarTitle}>Dashboard</div>
          <div className={styles.topbarActions}>
            <Link href="/api/auth/logout" className="btn">Logout</Link>
          </div>
        </header>
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
}
