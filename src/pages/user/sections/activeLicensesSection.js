
import React from "react";

import "../sections/styles/activeLicensesSection.scss";
import { useLicenses } from "../../../context/licensesContext";

const STATUS_MAP = {
  1: { label: "Inactive", color: "#b0b0b0" },
  2: { label: "Active", color: "#5cb85c" },
  3: { label: "Expired", color: "#e95d5d" }
};

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr.replace(" ", "T"));
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

const ActiveLicensesSection = () => {
  const { licenses, loading, productsMap } = useLicenses();

  if (!licenses) return null;

  return (
    <div className="active-licenses-section">
      <h3>🛡️ Your Licenses</h3>
      {loading && <p>Loading...</p>}
      {!loading && licenses.length === 0 && (
        <div className="no-licenses">
          <p>No licenses found.</p>
        </div>
      )}
      <div className="licenses-grid">
        {licenses.map((lic) => (
          <div className="license-card" key={lic.id}>
            <div className="license-header">
              <span className="license-product">
                {productsMap[lic.product_id] || `Product #${lic.product_id}`}
              </span>
              <span
                className="license-status"
                style={{
                  background: STATUS_MAP[lic.status]?.color || "#ccc"
                }}
              >
                {STATUS_MAP[lic.status]?.label || "Unknown"}
              </span>
            </div>
            <div className="license-body">
              <div className="license-expires">
                Expires: <b>{formatDate(lic.expires_at)}</b>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveLicensesSection;
