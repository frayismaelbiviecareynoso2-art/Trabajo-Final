
const SEED_KEY="merad_admin_seed_v2", PUBLIC_KEY="merad_public_requests_v2", SESSION_KEY="merad_admin_session_v2";
const PAGE_SIZE=10;
let page=1, query="", filterStatus="";
const $=s=>document.querySelector(s);

function safe(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function cloneSeed(){return JSON.parse(JSON.stringify(window.MERAD_SEED_DATA||[]));}
function getSeed(){try{return JSON.parse(localStorage.getItem(SEED_KEY))||cloneSeed()}catch(e){return cloneSeed()}}
function saveSeed(rows){try{localStorage.setItem(SEED_KEY,JSON.stringify(rows))}catch(e){}}
function getPublic(){try{return JSON.parse(localStorage.getItem(PUBLIC_KEY))||[]}catch(e){return []}}
function allRows(){return [...getPublic(),...getSeed()]}
function fmt(d){if(!d)return"—";const [y,m,day]=d.split("-");return `${day}/${m}/${y}`}
function cls(s){s=(s||"").toLowerCase();if(s.includes("confirm"))return"confirmed";if(s.includes("complet"))return"completed";if(s.includes("cancel"))return"cancelled";return"pending"}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.x);toast.x=setTimeout(()=>t.classList.remove("show"),2200)}
async function sha256(text){
 const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));
 return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
}
function isAuthenticated(){return sessionStorage.getItem(SESSION_KEY)==="1"}
function showAdmin(){
 $("#loginView").classList.add("hidden"); $("#adminView").classList.remove("hidden");
 if(!localStorage.getItem(SEED_KEY))saveSeed(cloneSeed());
 render();
}
function showLogin(){ $("#adminView").classList.add("hidden"); $("#loginView").classList.remove("hidden"); }

$("#loginForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const user=$("#username").value.trim();
 const hash=await sha256($("#password").value);
 if(user===window.MERAD_LOGIN.user && hash===window.MERAD_LOGIN.passwordHash){
   sessionStorage.setItem(SESSION_KEY,"1"); $("#loginError").textContent=""; showAdmin(); toast("Acceso concedido.");
 }else{
   $("#loginError").textContent="Usuario o contraseña incorrectos.";
 }
});
$("#logoutBtn").addEventListener("click",()=>{sessionStorage.removeItem(SESSION_KEY);showLogin();$("#password").value="";});
$("#search").addEventListener("input",e=>{query=e.target.value.toLowerCase();page=1;render();});
$("#statusFilter").addEventListener("change",e=>{filterStatus=e.target.value;page=1;render();});
$("#prev").addEventListener("click",()=>{page=Math.max(1,page-1);render();});
$("#next").addEventListener("click",()=>{page++;render();});
$("#resetBtn").addEventListener("click",()=>{saveSeed(cloneSeed());page=1;query="";filterStatus="";$("#search").value="";$("#statusFilter").value="";render();toast("Datos ficticios restaurados.");});

function filteredRows(){
 return allRows().filter(r=>{
  const matchesQuery=!query || [r.id,r.name,r.phone,r.service,r.status].join(" ").toLowerCase().includes(query);
  const matchesStatus=!filterStatus || r.status===filterStatus;
  return matchesQuery && matchesStatus;
 });
}
function render(){
 const rows=filteredRows(), max=Math.max(1,Math.ceil(rows.length/PAGE_SIZE)); if(page>max)page=max;
 const slice=rows.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
 $("#tbody").innerHTML=slice.map(r=>`<tr><td><b>${safe(r.id)}</b></td><td>${safe(r.name)}</td><td>${safe(r.phone)}</td><td>${safe(r.service)}</td><td>${fmt(r.date)}</td><td>${safe(r.time)}</td><td><span class="pill ${cls(r.status)}">${safe(r.status)}</span></td></tr>`).join("")||`<tr><td colspan="7" style="text-align:center;padding:28px;color:#777">No hay resultados.</td></tr>`;
 $("#pageInfo").textContent=`Página ${page} de ${max}`;$("#prev").disabled=page<=1;$("#next").disabled=page>=max;
 const all=allRows();
 $("#statTotal").textContent=all.length;
 $("#statPending").textContent=all.filter(r=>r.status==="Pendiente").length;
 $("#statConfirmed").textContent=all.filter(r=>r.status==="Confirmada").length;
 $("#statCompleted").textContent=all.filter(r=>r.status==="Completada").length;
}
if(isAuthenticated())showAdmin();else showLogin();
