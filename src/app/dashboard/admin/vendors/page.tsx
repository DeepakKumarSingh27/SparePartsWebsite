import { prisma } from "@/lib/prisma";
import VendorManagementTable from "./VendorManagementTable";

export default async function VendorsPage() {
  const vendors = await prisma.vendorProfile.findMany({
    include: {
      user: {
        select: { email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: "2rem", fontSize: "1.5rem", fontWeight: "600" }}>Manage Vendors</h1>
      
      <div className="card" style={{ padding: "1.5rem" }}>
        <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
          View and manage all vendor applications and commission rates here.
        </p>
        <VendorManagementTable initialVendors={vendors} />
      </div>
    </div>
  );
}
