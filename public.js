
const KEY="merad_public_requests_v2";
const $=s=>document.querySelector(s);
function safe(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.x);toast.x=setTimeout(()=>t.classList.remove("show"),2300);}
function load(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return []}}
function save(rows){try{localStorage.setItem(KEY,JSON.stringify(rows))}catch(e){}}
const date=document.querySelector('input[name="date"]');
const now=new Date();date.min=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);

$("#bookingForm").addEventListener("submit",e=>{
 e.preventDefault();
 const f=new FormData(e.currentTarget);
 const digits=String(f.get("phone")).replace(/\D/g,"");
 if(digits.length!==10){toast("Usa un número de 10 dígitos.");return;}
 const row={
  id:"WEB-"+Date.now().toString().slice(-7),
  name:String(f.get("name")).trim(),
  phone:String(f.get("phone")).trim(),
  service:f.get("service"),
  date:f.get("date"),
  time:f.get("time"),
  status:"Pendiente",
  message:String(f.get("message")||"").trim(),
  source:"Formulario web"
 };
 const rows=load(); rows.unshift(row); save(rows);
 const [y,m,d]=row.date.split("-");
 $("#confirmText").innerHTML=`<b>${safe(row.name)}</b>, recibimos tu solicitud para <b>${safe(row.service)}</b> el <b>${d}/${m}/${y}</b> a las <b>${safe(row.time)}</b>.`;
 e.currentTarget.reset(); toast("Solicitud guardada en el prototipo.");
});
