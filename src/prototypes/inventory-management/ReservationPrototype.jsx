import { useState, useEffect } from 'react';

// ── PLACEHOLDER: Full prototype — see reservation_prototype.jsx in project files
// This will be replaced with the full 1,168-line component on next push from local git

export default function ReservationPrototype() {
  return (
    <div style={{ fontFamily:"'Segoe UI',Arial,sans-serif", background:"#f4f5f7", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", border:"1px solid #e0e3ea", borderRadius:8, padding:"40px 48px", textAlign:"center", maxWidth:480 }}>
        <div style={{ width:48, height:48, borderRadius:"50%", background:"#e65c00", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
          <span style={{ color:"#fff", fontSize:20, fontWeight:700 }}>GO</span>
        </div>
        <h2 style={{ margin:"0 0 12px", fontSize:20, fontWeight:700, color:"#1a2340" }}>Inventory Reservation & TPID Management</h2>
        <p style={{ margin:"0 0 8px", fontSize:13, color:"#6b7280", lineHeight:1.6 }}>GM-292020 · EL ATL · September 2026</p>
        <p style={{ margin:"0 0 24px", fontSize:13, color:"#6b7280", lineHeight:1.6 }}>
          Full prototype file is large (~90KB). Clone the repo and run <code style={{ background:"#f4f5f7", padding:"1px 6px", borderRadius:3, fontSize:12 }}>npm run dev</code> locally to view the complete interactive prototype.
        </p>
        <a href="https://github.com/shilpas-commits/greyorange-prototypes" target="_blank" rel="noreferrer"
           style={{ display:"inline-block", padding:"8px 20px", background:"#e65c00", color:"#fff", borderRadius:5, textDecoration:"none", fontSize:13, fontWeight:600 }}>
          View on GitHub →
        </a>
      </div>
    </div>
  );
}
