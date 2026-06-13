/* ==========================================================================
   PINCHA & ASSOCIATES — site data + behaviour
   --------------------------------------------------------------------------
   EVERYTHING BELOW CAN BE EDITED FROM A GOOGLE SHEET. Until you set that up,
   the site shows the DEFAULTS baked in here, so it always works.

   ░░ HOW TO MAKE IT GOOGLE-SHEET EDITABLE (one-time setup) ░░
   1. Create ONE Google Sheet. Add these 5 tabs (exact lower-case names):
        settings   offices   insights   openings   team
   2. Put a header row in each tab, then your data. Layouts:

      • settings  (two columns: key | value)
            key             value
            email           info@pinchaassociates.in
            careers_email   careers@pinchaassociates.in
            phone           +91 97838 31381
            whatsapp        919783831381

      • offices   (columns: city | type | address | state)
            city     type          address                          state
            Bikaner  Head Office   Office 210, 2nd Floor, Shanti..   Rajasthan 334001
            Jaipur   Branch        Nayashikha Apartments, Gandhi..  Rajasthan 302015
            ...                                                     (addresses may contain commas — that's fine)

      • insights  (columns: date | tag | title | text)   date format YYYY-MM-DD
            date        tag          title                       text
            2026-06-10  Income Tax   ITR filing open AY 2026-27  Filing utilities are available...

      • openings  (columns: role | location | type)
            role               location   type
            Article Assistant  Bikaner    Articleship

      • team      (two columns: key | value)
            key     value
            cas     5
            staff   16

   3. Share the sheet:  Share -> General access -> "Anyone with the link" ->
      Viewer.   (Reading only; nothing private should be in this sheet.)
   4. Copy the Sheet ID from its URL — the long code between /d/ and /edit:
        docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit
   5. Paste it into SHEET_ID below.  Save & re-upload site.js.   Done —
      from now on you edit the sheet, the website updates automatically.
   ========================================================================== */

const SHEET_ID = "";   // <-- paste your Google Sheet ID between the quotes

/* ---------- DEFAULT CONTENT (used when SHEET_ID is empty or unreachable) --- */
const DEFAULTS = {
  settings: {
    email: "info@yourdomain.in",
    careers_email: "careers@yourdomain.in",
    phone: "+91 97838 31381",
    whatsapp: "919783831381"
  },
  team: { cas: "5", staff: "16" },
  offices: [
    { city:"Bikaner", type:"Head Office", address:"Office 210, 2nd Floor, Shanti Tower, Near Junagarh Fort", state:"Rajasthan 334001" },
    { city:"Jaipur", type:"Branch", address:"Nayashikha Apartments, Gandhi Nagar", state:"Rajasthan 302015" },
    { city:"Jodhpur", type:"Branch", address:"Near LIC Office, Paota", state:"Rajasthan 342001" },
    { city:"Kota", type:"Branch", address:"17-A, New Colony, Behind HDFC Bank, Near Govt. Girls School, Gumanpura", state:"Rajasthan 324007" },
    { city:"Sri Ganganagar", type:"Branch", address:"Gate No. 04, Bada Bazar, PD 22-23, Palika Bazar Basement, Near Ganesh Talkies Rd", state:"Rajasthan 335001" },
    { city:"Surat", type:"Branch", address:"102, VR Surat, Dumas Road, Magdalla", state:"Gujarat 395007" },
    { city:"Varanasi", type:"Branch", address:"E-71, Near Chandmari Police Chauki, Christ Nagar, VDA Colony, Bada Lalpur, Chandmari", state:"Uttar Pradesh 221002" }
  ],
  insights: [
    { date:"2026-06-10", tag:"Income Tax", title:"ITR filing open for AY 2026–27", text:"Filing utilities are available. Please share documents early to avoid the rush near the due date." },
    { date:"2026-06-05", tag:"GST", title:"Reminder: GSTR-3B for May 2026", text:"Monthly summary return and payment fall due on the 20th. Reach out if you need help with reconciliation." },
    { date:"2026-05-20", tag:"Compliance", title:"Quarterly TDS statements", text:"Ensure TDS returns for the quarter are filed within the prescribed due dates to avoid late fees." }
  ],
  openings: [
    { role:"Article Assistant", location:"Bikaner", type:"Articleship" },
    { role:"Semi-Qualified Assistant — Audit & Tax", location:"Jaipur", type:"Full-time" },
    { role:"Accountant", location:"Surat", type:"Full-time" }
  ]
};

/* ---------- CSV parsing (handles quoted fields with commas) --------------- */
function parseCSV(text){
  const rows=[]; let row=[], field="", i=0, q=false;
  while(i<text.length){
    const c=text[i];
    if(q){
      if(c==='"'){ if(text[i+1]==='"'){ field+='"'; i++; } else q=false; }
      else field+=c;
    } else {
      if(c==='"') q=true;
      else if(c===',') { row.push(field); field=""; }
      else if(c==='\n'){ row.push(field); rows.push(row); row=[]; field=""; }
      else if(c!=='\r') field+=c;
    }
    i++;
  }
  if(field.length||row.length){ row.push(field); rows.push(row); }
  return rows.filter(r=> r.some(c=> c.trim()!==""));
}
function rowsToObjects(rows){
  if(rows.length<2) return [];
  const head=rows[0].map(h=>h.trim().toLowerCase());
  return rows.slice(1).map(r=>{ const o={}; head.forEach((h,i)=> o[h]=(r[i]||"").trim()); return o; });
}
function rowsToKeyValue(rows){
  const o={}; rows.forEach((r,i)=>{ if(i===0 && r[0] && r[0].trim().toLowerCase()==="key") return; if(r[0]) o[r[0].trim().toLowerCase()]=(r[1]||"").trim(); });
  return o;
}
async function fetchTab(tab){
  if(!SHEET_ID) return null;
  const url=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
  try{ const res=await fetch(url); if(!res.ok) return null; return parseCSV(await res.text()); }
  catch(e){ return null; }
}

/* ---------- renderers ----------------------------------------------------- */
const esc = s => (s==null?"":String(s)).replace(/[&<>]/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;" }[c]));
const waBase = () => "919783831381";

function renderSettings(s){
  document.querySelectorAll(".js-email").forEach(el=>{ el.textContent=s.email; if(el.tagName==="A") el.href="mailto:"+s.email; });
  document.querySelectorAll(".js-careers-email").forEach(el=>{ el.textContent=s.careers_email; if(el.tagName==="A") el.href="mailto:"+s.careers_email; });
  document.querySelectorAll(".js-phone").forEach(el=>{ el.textContent=s.phone; if(el.tagName==="A") el.href="tel:+"+s.phone.replace(/[^0-9]/g,""); });
  document.querySelectorAll(".js-wa").forEach(el=>{ if(el.tagName==="A") el.href="https://wa.me/"+(s.whatsapp||waBase()); });
}
function renderTeam(t){
  const a=document.getElementById("stat-cas"), b=document.getElementById("stat-staff");
  if(a && t.cas) a.textContent=t.cas;
  if(b && t.staff) b.textContent=t.staff;
}
function officeCard(o){
  const head = (o.type||"").toLowerCase().indexOf("head")>-1;
  return `<div class="off ${head?'head':''} reveal">
    <div class="tag">${esc(o.type||'Branch')}</div>
    <h3>${esc(o.city)}</h3>
    <p>${esc(o.address)}${o.state?(', '+esc(o.state)):''}</p>
  </div>`;
}
function renderOffices(list){
  const sorted=[...list].sort((a,b)=>{ const ah=(a.type||'').toLowerCase().includes('head')?0:1, bh=(b.type||'').toLowerCase().includes('head')?0:1; return ah-bh; });
  const full=document.getElementById("offices-grid");
  if(full) full.innerHTML=sorted.map(officeCard).join("");
  const prev=document.getElementById("offices-preview");
  if(prev) prev.innerHTML=sorted.map(officeCard).join("");
  observeReveals();
}
function insCard(u){
  const d=new Date((u.date||"")+"T00:00:00");
  const date=isNaN(d)? esc(u.date) : d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
  return `<article class="ins reveal"><div class="meta"><span class="tag">${esc(u.tag||'Update')}</span><span class="date">${date}</span></div><h3>${esc(u.title)}</h3><p>${esc(u.text)}</p></article>`;
}
function renderInsights(list){
  const sorted=[...list].sort((a,b)=> new Date(b.date)-new Date(a.date));
  const full=document.getElementById("insights-grid");
  if(full) full.innerHTML = sorted.length? sorted.map(insCard).join("") : '<p class="ins-empty">No updates at the moment.</p>';
  const prev=document.getElementById("insights-preview");
  if(prev) prev.innerHTML = sorted.slice(0,3).map(insCard).join("");
  observeReveals();
}
function renderOpenings(list){
  const el=document.getElementById("openings-list"); if(!el) return;
  if(!list.length){ el.innerHTML='<p class="openings-empty">No specific openings right now — we welcome applications year-round.</p>'; return; }
  el.innerHTML=list.map(o=>{
    const msg=encodeURIComponent(`Hello, I would like to apply for the ${o.role} (${o.location}) role at Pincha and Associates. My details: `);
    return `<div class="opening"><div><div class="role">${esc(o.role)}</div><div class="loc">${esc(o.type)} · ${esc(o.location)}</div></div><a class="apply" href="https://wa.me/${waBase()}?text=${msg}" target="_blank" rel="noopener">Apply <span class="ar">&rarr;</span></a></div>`;
  }).join("");
}

/* ---------- boot ---------------------------------------------------------- */
async function loadAll(){
  // settings
  let s=DEFAULTS.settings; const sRows=await fetchTab("settings");
  if(sRows){ const kv=rowsToKeyValue(sRows); s={...DEFAULTS.settings,...kv}; }
  renderSettings(s);
  // team
  let t=DEFAULTS.team; const tRows=await fetchTab("team");
  if(tRows){ const kv=rowsToKeyValue(tRows); t={...DEFAULTS.team,...kv}; }
  renderTeam(t);
  // offices
  let off=DEFAULTS.offices; const oRows=await fetchTab("offices");
  if(oRows){ const objs=rowsToObjects(oRows); if(objs.length) off=objs; }
  renderOffices(off);
  // insights
  let ins=DEFAULTS.insights; const iRows=await fetchTab("insights");
  if(iRows){ const objs=rowsToObjects(iRows); if(objs.length) ins=objs; }
  renderInsights(ins);
  // openings
  let op=DEFAULTS.openings; const pRows=await fetchTab("openings");
  if(pRows){ const objs=rowsToObjects(pRows); op=objs; }
  renderOpenings(op);
}

/* ---------- UI behaviour -------------------------------------------------- */
let _io;
function observeReveals(){
  if(!_io) _io=new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); _io.unobserve(e.target);} }); },{threshold:0.12});
  document.querySelectorAll(".reveal:not(.in)").forEach(el=>_io.observe(el));
}
function initUI(){
  const y=document.getElementById("yr"); if(y) y.textContent=new Date().getFullYear();
  const burger=document.getElementById("burger"), menu=document.getElementById("menu");
  if(burger&&menu){
    burger.addEventListener("click",()=>{ const o=menu.classList.toggle("open"); burger.setAttribute("aria-expanded",o); });
    menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{ menu.classList.remove("open"); burger.setAttribute("aria-expanded",false); }));
  }
  const form=document.getElementById("enquiry");
  if(form) form.addEventListener("submit",e=>{
    e.preventDefault();
    const n=(document.getElementById("name").value||"").trim(), c=(document.getElementById("email").value||"").trim(), m=(document.getElementById("msg").value||"").trim();
    const text=`Enquiry from website%0A%0AName: ${encodeURIComponent(n)}%0AContact: ${encodeURIComponent(c)}%0A%0A${encodeURIComponent(m)}`;
    window.open("https://wa.me/"+waBase()+"?text="+text,"_blank");
  });
  observeReveals();
}
document.addEventListener("DOMContentLoaded",()=>{ initUI(); loadAll(); });
