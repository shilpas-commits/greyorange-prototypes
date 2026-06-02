import { useState } from "react";

const C = {
  navy:"#1a2340",navyLight:"#243058",orange:"#e65c00",border:"#d0d5df",muted:"#6b7280",bg:"#f4f5f7",
  green:"#2e7d32",greenBg:"#e8f5e9",greenBdr:"#a5d6a7",red:"#c62828",redBg:"#ffebee",redBdr:"#ef9a9a",
  amber:"#e65100",amberBg:"#fff3e0",amberBdr:"#ffcc80",blue:"#1565c0",blueBg:"#e3f2fd",blueBdr:"#bbdefb",
  purple:"#6a1b9a",purpleBg:"#f3e5f5",purpleBdr:"#ce93d8",white:"#ffffff",surface:"#ffffff",
};

const ORDERS = [
  { id:"ORD-SAP-7821",flowType:"REPLEN-Emergency",pbt:"10:30",totalMBs:1240,picked:820,shortPicked:12,pending:408,status:"IN_PROGRESS",estRemaining:5,
    rollcages:[
      {id:"RC-ATL-00410",type:"Rollcage-A",station:"STN-04",dockPoint:"D4-01",status:"COMPLETE",totalBins:8,filledBins:8,carryingUnits:["TT-10021","TT-10022","TT-10023","TT-10024","TT-10025","TT-10026","TT-10027","TT-10028"],mbs:124,labelScan:true,seq:"1 of 10"},
      {id:"RC-ATL-00411",type:"Rollcage-A",station:"STN-04",dockPoint:"D4-01",status:"COMPLETE",totalBins:8,filledBins:8,carryingUnits:["TT-10029","TT-10030","TT-10031","TT-10032","TT-10033","TT-10034","TT-10035","TT-10036"],mbs:124,labelScan:true,seq:"2 of 10"},
      {id:"RC-ATL-00412",type:"Rollcage-A",station:"STN-04",dockPoint:"D4-02",status:"PICKING",totalBins:8,filledBins:5,carryingUnits:["TT-10037","TT-10038","TT-10039","TT-10040","TT-10041","\u2014","\u2014","\u2014"],mbs:72,labelScan:false,seq:"3 of 10"},
      {id:"RC-ATL-00413",type:"Rollcage-B",station:"STN-04",dockPoint:"D4-03",status:"STAGED",totalBins:6,filledBins:0,carryingUnits:["TT-10042","TT-10043","TT-10044","\u2014","\u2014","\u2014"],mbs:0,labelScan:false,seq:"4 of 10"},
      {id:"RC-ATL-00414",type:"Rollcage-A",station:"STN-04",dockPoint:"\u2014",status:"PLANNED",totalBins:8,filledBins:0,carryingUnits:[],mbs:0,labelScan:false,seq:"5 of 10"},
    ]
  },
  { id:"ORD-SAP-7823",flowType:"ST02",pbt:"11:45",totalMBs:380,picked:380,shortPicked:2,pending:0,status:"COMPLETE",estRemaining:0,
    rollcages:[
      {id:"RC-ATL-00400",type:"Rollcage-A",station:"STN-02",dockPoint:"D2-01",status:"COMPLETE",totalBins:8,filledBins:8,carryingUnits:["TT-10001","TT-10002","TT-10003","TT-10004","TT-10005","TT-10006","TT-10007","TT-10008"],mbs:128,labelScan:true,seq:"1 of 3"},
      {id:"RC-ATL-00401",type:"Rollcage-A",station:"STN-02",dockPoint:"D2-01",status:"COMPLETE",totalBins:8,filledBins:8,carryingUnits:["TT-10009","TT-10010","TT-10011","TT-10012","TT-10013","TT-10014","TT-10015","TT-10016"],mbs:128,labelScan:true,seq:"2 of 3"},
      {id:"RC-ATL-00402",type:"Rollcage-A",station:"STN-02",dockPoint:"D2-01",status:"COMPLETE",totalBins:8,filledBins:4,carryingUnits:["TT-10017","TT-10018","TT-10019","TT-10020","\u2014","\u2014","\u2014","\u2014"],mbs:124,labelScan:true,seq:"3 of 3"},
    ]
  },
  { id:"ORD-SAP-7826",flowType:"LG02-VAS",pbt:"13:00",totalMBs:640,picked:0,shortPicked:0,pending:640,status:"PENDING",estRemaining:null,rollcages:[] },
];

const ORDER_STATUS = {
  IN_PROGRESS:{label:"IN PROGRESS",bg:"#fff3e0",color:"#e65100",border:"#ffcc80"},
  COMPLETE:{label:"COMPLETE",bg:"#e8f5e9",color:"#2e7d32",border:"#a5d6a7"},
  PENDING:{label:"PENDING",bg:"#f1f3f4",color:"#6b7280",border:"#d0d5df"},
};
const RC_STATUS = {
  COMPLETE:{label:"COMPLETE",bg:"#e8f5e9",color:"#2e7d32",border:"#a5d6a7",dot:"\u25cf"},
  PICKING:{label:"PICKING",bg:"#fff3e0",color:"#e65100",border:"#ffcc80",dot:"\u25c9"},
  STAGED:{label:"STAGED",bg:"#e3f2fd",color:"#1565c0",border:"#bbdefb",dot:"\u25cb"},
  PLANNED:{label:"PLANNED",bg:"#f1f3f4",color:"#6b7280",border:"#d0d5df",dot:"\u00b7"},
};

function FlowTag({ type }) {
  const MAP = {"REPLEN-Emergency":{bg:"#ffebee",color:"#c62828",border:"#ef9a9a"},"ST02":{bg:"#e3f2fd",color:"#1565c0",border:"#bbdefb"},"LG02-VAS":{bg:"#f3e5f5",color:"#6a1b9a",border:"#ce93d8"},"BPUT":{bg:"#e8f5e9",color:"#2e7d32",border:"#a5d6a7"},"PK02":{bg:"#f1f3f4",color:"#6b7280",border:"#d0d5df"}};
  const s = MAP[type] || MAP["PK02"];
  return <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:5,background:s.bg,color:s.color,border:`1px solid ${s.border}`}}>{type}</span>;
}

function RollcageRow({ rc }) {
  const [showUnits, setShowUnits] = useState(false);
  const rcs = RC_STATUS[rc.status];
  const fillPct = rc.totalBins > 0 ? Math.round((rc.filledBins / rc.totalBins) * 100) : 0;
  return (
    <>
      <div style={{display:"grid",gridTemplateColumns:"24px 200px 140px 70px 1fr 120px 100px",gap:0,padding:"8px 24px 8px 48px",background:rc.status==="PICKING"?"#fffdf5":"#fafafa",borderBottom:`1px solid #eef0f3`,alignItems:"center",borderLeft:`3px solid ${rc.status==="PICKING"?C.orange:rc.status==="COMPLETE"?C.green:"transparent"}`}}>
        <span style={{color:C.border,fontSize:12}}>{"\u2514"}</span>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:11,fontWeight:700,color:C.navy,fontFamily:"'DM Mono',monospace"}}>{rc.id}</span>
            <span style={{fontSize:9,color:C.muted}}>{"\u00b7 "}{rc.seq}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4,marginTop:2}}>
            <span style={{fontSize:9,padding:"1px 6px",borderRadius:3,background:C.navy,color:"rgba(255,255,255,0.8)"}}>{rc.type}</span>
            <span style={{fontSize:9,color:C.muted}}>{rc.station}{rc.dockPoint!=="\u2014"?` \u00b7 ${rc.dockPoint}`:""}</span>
            {rc.carryingUnits.length>0&&<button onClick={()=>setShowUnits(s=>!s)} style={{fontSize:9,padding:"1px 6px",borderRadius:3,border:`1px solid ${C.blueBdr}`,background:showUnits?C.blueBg:"#fff",color:C.blue,cursor:"pointer",fontFamily:"inherit"}}>{showUnits?"Hide":"Show"} units ({rc.carryingUnits.filter(u=>u!=="\u2014").length})</button>}
          </div>
        </div>
        <span style={{fontSize:10,color:C.muted}}>{"\u21b3 inherited"}</span>
        <div>{rc.labelScan?<span style={{fontSize:10,color:C.green,fontWeight:700}}>{"\u2713 Label"}</span>:<span style={{fontSize:10,color:C.muted}}>{"\u2014 Label"}</span>}</div>
        <div style={{paddingRight:20}}>
          <div style={{height:5,background:"#e8eaf0",borderRadius:3,marginBottom:4}}><div style={{height:5,borderRadius:3,width:`${fillPct}%`,background:rc.status==="COMPLETE"?C.green:C.orange}} /></div>
          <div style={{display:"flex",gap:2}}>{Array.from({length:rc.totalBins}).map((_,i)=><div key={i} style={{width:14,height:14,borderRadius:3,background:i<rc.filledBins?(rc.status==="COMPLETE"?C.green:C.orange):"#e0e3ea",border:`1px solid ${i<rc.filledBins?"transparent":C.border}`}} />)}</div>
          <div style={{fontSize:9,color:C.muted,marginTop:2}}>{rc.filledBins}/{rc.totalBins} bins {rc.mbs>0?`\u00b7 ${rc.mbs} MBs`:"\u00b7 \u2014"}</div>
        </div>
        <div style={{display:"inline-flex",alignItems:"center",gap:4,background:rcs.bg,color:rcs.color,border:`1px solid ${rcs.border}`,borderRadius:5,padding:"3px 9px",fontSize:10,fontWeight:700}}><span>{rcs.dot}</span>{rcs.label}</div>
        <div>{rc.status==="COMPLETE"&&rc.labelScan&&<span style={{fontSize:9,color:C.green,fontWeight:700}}>Released \u2713</span>}{rc.status==="PICKING"&&<span style={{fontSize:9,color:C.amber,fontWeight:700}}>Picking\u2026</span>}{rc.status==="STAGED"&&<span style={{fontSize:9,color:C.blue,fontWeight:700}}>Ready</span>}{rc.status==="PLANNED"&&<span style={{fontSize:9,color:C.muted}}>Queued</span>}</div>
      </div>
      {showUnits&&(
        <div style={{padding:"8px 24px 10px 72px",background:"#f0f4ff",borderBottom:`1px solid #e0e5f0`}}>
          <div style={{fontSize:9,fontWeight:700,color:C.blue,letterSpacing:0.8,marginBottom:6,textTransform:"uppercase"}}>Carrying Units \u00b7 {rc.id}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {rc.carryingUnits.map((u,i)=>(
              <div key={i} style={{background:u==="\u2014"?"#f1f3f4":"#fff",border:`1px solid ${u==="\u2014"?C.border:C.blueBdr}`,borderRadius:5,padding:"3px 10px",fontSize:10,fontWeight:u!=="\u2014"?600:400,color:u==="\u2014"?C.muted:C.blue,fontFamily:"'DM Mono',monospace",display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:9,color:C.muted}}>Bin {i+1}</span><span style={{color:"rgba(0,0,0,0.15)"}}>\u00b7</span>{u}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function OrderRow({ order, expanded, onToggle }) {
  const os = ORDER_STATUS[order.status];
  const pct = order.totalMBs>0?Math.round(((order.picked+order.shortPicked)/order.totalMBs)*100):0;
  return (
    <>
      <div onClick={onToggle} style={{display:"grid",gridTemplateColumns:"24px 200px 140px 70px 1fr 120px 100px",gap:0,padding:"12px 24px",cursor:"pointer",background:expanded?"#fafbff":"#fff",borderBottom:`1px solid ${C.border}`,alignItems:"center",borderLeft:`3px solid ${order.status==="IN_PROGRESS"?C.orange:order.status==="COMPLETE"?C.green:C.border}`}}>
        <span style={{color:C.muted,fontSize:12,userSelect:"none"}}>{order.rollcages.length>0?(expanded?"\u25be":"\u25b8"):"\u00b7"}</span>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{order.id}</div>
          <div style={{fontSize:10,color:C.muted,marginTop:2}}>{order.rollcages.length} rollcage{order.rollcages.length!==1?"s":""}{order.estRemaining>0?` \u00b7 ~${order.estRemaining} more est.`:""}</div>
        </div>
        <FlowTag type={order.flowType} />
        <span style={{fontSize:12,fontWeight:700,color:order.status==="IN_PROGRESS"?C.amber:order.status==="COMPLETE"?C.green:C.muted}}>{order.pbt}</span>
        <div style={{paddingRight:20}}>
          <div style={{display:"flex",gap:8,marginBottom:4,fontSize:11,color:C.navy}}>
            <span style={{color:C.green,fontWeight:700}}>{order.picked.toLocaleString()} picked</span>
            {order.shortPicked>0&&<span style={{color:C.red}}>{"\u00b7 "}{order.shortPicked} short</span>}
            <span style={{color:C.muted}}>{"\u00b7 "}{order.pending.toLocaleString()} pending</span>
          </div>
          <div style={{height:6,background:"#e8eaf0",borderRadius:3,display:"flex",overflow:"hidden"}}>
            <div style={{width:`${(order.picked/order.totalMBs)*100}%`,background:C.green}} />
            <div style={{width:`${(order.shortPicked/order.totalMBs)*100}%`,background:C.red}} />
          </div>
          <div style={{fontSize:10,color:C.muted,marginTop:2}}>{pct}% \u00b7 {order.totalMBs.toLocaleString()} total MBs</div>
        </div>
        <div style={{display:"inline-flex",alignItems:"center",background:os.bg,color:os.color,border:`1px solid ${os.border}`,borderRadius:6,padding:"3px 10px",fontSize:10,fontWeight:700}}>{os.label}</div>
        <div><button style={{fontSize:10,padding:"4px 8px",borderRadius:5,border:`1px solid ${C.border}`,background:"#fff",color:C.navy,cursor:"pointer",fontFamily:"inherit"}}>Detail</button></div>
      </div>
      {expanded&&order.rollcages.map(rc=><RollcageRow key={rc.id} rc={rc} />)}
      {expanded&&order.rollcages.length===0&&<div style={{padding:"10px 24px 10px 60px",background:"#f9fafb",borderBottom:`1px solid ${C.border}`,fontSize:11,color:C.muted,fontStyle:"italic"}}>No rollcages yet \u2014 cartonization will begin when this order enters the pick queue.</div>}
    </>
  );
}

export default function MDOutboundView() {
  const [expanded, setExpanded] = useState({"ORD-SAP-7821":true});
  const [filters, setFilters] = useState({flowType:"All",status:"All"});
  const [lastUpdate, setLastUpdate] = useState("09:48:12");
  const handleFilter = (key,val) => setFilters(f=>({...f,[key]:val}));
  const handleRefresh = () => { const n=new Date(); setLastUpdate(`${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}:${String(n.getSeconds()).padStart(2,"0")}`); };
  const filteredOrders = ORDERS.filter(o => {
    if(filters.flowType!=="All"&&o.flowType!==filters.flowType) return false;
    if(filters.status!=="All"&&o.status!==filters.status) return false;
    return true;
  });
  const FLOW_TYPES=["All","REPLEN-Emergency","REPLEN-Delivery","ST02","LG02-VAS","BPUT","PK02"];
  const STATUSES=["All","IN_PROGRESS","COMPLETE","PENDING"];
  return (
    <div style={{minHeight:"100vh",background:"#e2e6ee",fontFamily:"'Segoe UI',Arial,sans-serif",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{width:"100%",background:C.navy,padding:"14px 32px",display:"flex",alignItems:"center",gap:16,marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{background:"#fff",borderRadius:5,padding:"4px 8px",display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:18,height:18,borderRadius:"50%",background:C.orange,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontSize:8,fontWeight:700}}>GO</span></div>
            <span style={{fontSize:12,fontWeight:700,color:C.orange}}>GreyOrange</span>
          </div>
          <span style={{color:"rgba(255,255,255,0.3)",fontSize:16}}>|</span>
          <span style={{color:"#fff",fontSize:13,fontWeight:600}}>Manager Dashboard \u2014 Outbound</span>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:12}}>
          <button onClick={handleRefresh} style={{padding:"5px 14px",borderRadius:5,border:"none",background:"rgba(255,255,255,0.12)",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{"\u21bb Refresh"}</button>
          <span style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>Epic 6 Req 6.5 + Epic 7 Req 7.1 \u00b7 EL ATL</span>
        </div>
      </div>
      <div style={{padding:"0 32px 48px",width:"fit-content"}}>
        <div style={{width:1200,background:C.bg,borderRadius:12,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.14)",border:`1px solid ${C.border}`,fontFamily:"'Segoe UI',Arial,sans-serif"}}>
          <div style={{background:C.navy,height:52,display:"flex",alignItems:"center",padding:"0 24px",gap:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:24,height:24,borderRadius:"50%",background:C.orange,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontSize:10,fontWeight:700}}>GO</span></div><span style={{color:"#fff",fontSize:14,fontWeight:700}}>GreyMatter Manager Dashboard</span></div>
            <span style={{color:"rgba(255,255,255,0.25)",fontSize:20}}>|</span>
            <span style={{color:"rgba(255,255,255,0.7)",fontSize:13,fontWeight:600}}>Outbound \u00b7 Bulk Orders</span>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:16}}>
              <span style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>Last updated: {lastUpdate}</span>
              <div style={{background:"rgba(46,125,50,0.2)",border:"1px solid rgba(46,125,50,0.4)",borderRadius:5,padding:"3px 10px"}}><span style={{color:"#81c784",fontSize:11,fontWeight:700}}>\u25cf LIVE</span></div>
              <span style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>EL ATL \u00b7 Shift A</span>
            </div>
          </div>
          <div style={{background:C.navyLight,padding:"10px 24px",display:"flex",gap:28,borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
            {[{label:"Active Orders",value:"2",sub:"1 urgent"},{label:"Rollcages Today",value:"8",sub:"5 complete \u00b7 3 active"},{label:"MBs Picked",value:"1,200",sub:"of 1,620 total"},{label:"SLA Adherence",value:"99.2%",sub:"vs 99% target"},{label:"Station Throughput",value:"312/hr",sub:"STN-04 leading"}].map((k,i)=>(
              <div key={i}><div style={{color:"rgba(255,255,255,0.45)",fontSize:10,letterSpacing:0.8,marginBottom:2}}>{k.label}</div><div style={{color:"#fff",fontSize:18,fontWeight:700}}>{k.value}</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:10}}>{k.sub}</div></div>
            ))}
          </div>
          <div style={{background:"#fff",padding:"10px 24px",display:"flex",alignItems:"center",gap:16,borderBottom:`1px solid ${C.border}`}}>
            <span style={{fontSize:12,fontWeight:600,color:C.navy}}>Filters:</span>
            <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:11,color:C.muted}}>Flow Type</span><select value={filters.flowType} onChange={e=>handleFilter("flowType",e.target.value)} style={{fontSize:11,border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 8px",fontFamily:"inherit",color:C.navy,background:"#fff"}}>{FLOW_TYPES.map(f=><option key={f}>{f}</option>)}</select></div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:11,color:C.muted}}>Status</span><select value={filters.status} onChange={e=>handleFilter("status",e.target.value)} style={{fontSize:11,border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 8px",fontFamily:"inherit",color:C.navy,background:"#fff"}}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>
            <div style={{marginLeft:"auto",fontSize:11,color:C.muted}}>{ORDERS.length} orders shown</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"24px 200px 140px 70px 1fr 120px 100px",gap:0,background:"#f9fafb",borderBottom:`1.5px solid ${C.border}`,padding:"8px 24px"}}>
            {["","Order / Rollcage","Flow Type","PBT","Progress","Status",""].map((h,i)=>(<div key={i} style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:0.8,textTransform:"uppercase"}}>{h}</div>))}
          </div>
          <div style={{maxHeight:520,overflowY:"auto"}}>
            {filteredOrders.map(order=>(<OrderRow key={order.id} order={order} expanded={!!expanded[order.id]} onToggle={()=>setExpanded(e=>({...e,[order.id]:!e[order.id]}))} />))}
          </div>
        </div>
        <div style={{marginTop:12,background:"#fff",borderRadius:8,padding:"12px 20px",border:`1px solid ${C.border}`,fontSize:11,color:C.muted,lineHeight:1.7,maxWidth:1200}}>
          <strong style={{color:C.navy}}>What's new in this view (vs. existing MD):</strong>{" "}
          Rollcage ID and Carrying Unit ID are now first-class fields \u2014 expand any order to see rollcage breakdown, click "Show units" to see the barcode-level carrying unit assignment per bin position. Bin-fill progress visualised per rollcage. Label scan status surfaced inline. Refreshes within 5 seconds of any state change (Epic 6 req 6.5). Rollcage completion event drives this data \u2014 no manual trigger (Epic 7 req 7.1).
        </div>
      </div>
    </div>
  );
}
