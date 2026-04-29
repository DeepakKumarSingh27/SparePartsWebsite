"use client";

import { useState } from "react";

type Vendor = {
  id: string;
  storeName: string;
  status: string;
  commissionRate: number;
  user: {
    email: string;
  };
};

export default function VendorManagementTable({ initialVendors }: { initialVendors: Vendor[] }) {
  const [vendors, setVendors] = useState(initialVendors);
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdate = async (vendorId: string, newStatus: string, newCommissionRate: number) => {
    setLoading(vendorId);
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, commissionRate: newCommissionRate })
      });
      
      if (res.ok) {
        const updatedVendor = await res.json();
        setVendors(vendors.map(v => v.id === vendorId ? { ...v, status: updatedVendor.status, commissionRate: updatedVendor.commissionRate } : v));
      } else {
        alert("Failed to update vendor");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating vendor");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "left" }}>
            <th style={{ padding: "1rem" }}>Store Name</th>
            <th style={{ padding: "1rem" }}>Email</th>
            <th style={{ padding: "1rem" }}>Status</th>
            <th style={{ padding: "1rem" }}>Commission (%)</th>
            <th style={{ padding: "1rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(vendor => (
            <VendorRow 
              key={vendor.id} 
              vendor={vendor} 
              onSave={(status, rate) => handleUpdate(vendor.id, status, rate)} 
              isLoading={loading === vendor.id}
            />
          ))}
          {vendors.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: "1rem", textAlign: "center", color: "var(--text-muted)" }}>
                No vendors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function VendorRow({ vendor, onSave, isLoading }: { vendor: Vendor, onSave: (status: string, rate: number) => void, isLoading: boolean }) {
  const [status, setStatus] = useState(vendor.status);
  const [commissionRate, setCommissionRate] = useState(vendor.commissionRate);

  const hasChanged = status !== vendor.status || commissionRate !== vendor.commissionRate;

  return (
    <tr style={{ borderBottom: "1px solid var(--border)" }}>
      <td style={{ padding: "1rem", fontWeight: "500" }}>{vendor.storeName}</td>
      <td style={{ padding: "1rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>{vendor.user.email}</td>
      <td style={{ padding: "1rem" }}>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}
        >
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </td>
      <td style={{ padding: "1rem" }}>
        <input 
          type="number" 
          value={commissionRate} 
          onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
          step="0.1"
          min="0"
          max="100"
          style={{ padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)", width: "80px" }}
        />
      </td>
      <td style={{ padding: "1rem" }}>
        <button 
          onClick={() => onSave(status, commissionRate)}
          disabled={!hasChanged || isLoading}
          className="btn"
          style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", opacity: (!hasChanged || isLoading) ? 0.5 : 1, cursor: (!hasChanged || isLoading) ? 'not-allowed' : 'pointer' }}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </td>
    </tr>
  );
}
