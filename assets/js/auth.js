/* Akun warga (halaman index.html) — profil, antrean, berita tersimpan.
   Login/daftar/lupa password ada di masuk.html. SIMULASI frontend (localStorage). */
(()=>{
"use strict";
const C=LmjCore,$=id=>document.getElementById(id);
const {K,store,esc,users,sid,user,msg,okPhone,okPw,PW_RULE,hashPw,newSalt}=C;
if(!user()){C.go("masuk.html");return}
const pad=n=>String(n).padStart(2,"0");
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fmtDate=s=>new Date(s+"T00:00:00").toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
const SLOTS=["08:00","09:00","10:00","11:00","13:00","14:00"],CAP=5;

/* ---------- Modal Akun ---------- */
let lastFocus=null;
function openModal(id){lastFocus=document.activeElement;$(id).classList.remove("hidden");document.body.style.overflow="hidden";
  const f=$(id).querySelector(".acct-panel:not(.hidden) input:not([readonly])");if(f)setTimeout(()=>f.focus(),40)}
function closeModal(id){$(id).classList.add("hidden");document.body.style.overflow="";if(lastFocus&&lastFocus.focus)lastFocus.focus()}
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
$("accountModal").addEventListener("click",e=>{if(e.target.id==="accountModal")closeModal("accountModal")});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("accountModal").classList.contains("hidden"))closeModal("accountModal")});

/* ---------- Akun Saya ---------- */
function openAccount(tab="profil"){
  const u=user();if(!u)return C.go("masuk.html");
  $("acctName").value=u.name;$("acctEmail").value=u.email;$("acctPhone").value=u.phone;
  $("acctHello").textContent=u.name;
  const today=new Date(),max=new Date();max.setDate(today.getDate()+14);
  $("qDate").min=iso(today);$("qDate").max=iso(max);
  renderQueue();renderBookmarks();renderSlots();showTab(tab);openModal("accountModal");
}
function showTab(t){
  document.querySelectorAll(".acct-tabs button").forEach(b=>{const on=b.dataset.tab===t;b.classList.toggle("active",on);b.setAttribute("aria-selected",on)});
  document.querySelectorAll(".acct-panel").forEach(p=>p.classList.toggle("hidden",p.dataset.tab!==t));
}
document.querySelectorAll(".acct-tabs button").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.tab)));

$("profileForm").addEventListener("submit",e=>{
  e.preventDefault();const m=$("profileMsg"),name=$("acctName").value.trim(),phone=$("acctPhone").value.trim();
  if(name.length<3)return msg(m,"Nama lengkap minimal 3 karakter.");
  if(!okPhone(phone))return msg(m,"Nomor WhatsApp harus diawali 08 dan terdiri dari 10–13 digit.");
  const all=users(),u=all.find(x=>x.id===sid());u.name=name;u.phone=phone;store.set(K.USERS,all);
  $("acctHello").textContent=name;renderNav();msg(m,"Profil disimpan.",true);
});
$("passwordForm").addEventListener("submit",async e=>{
  e.preventDefault();const m=$("passwordMsg");
  const cur=$("curPw").value,pw=$("newPw").value,pw2=$("newPw2").value;
  const all=users(),u=all.find(x=>x.id===sid());
  if(await hashPw(cur,u.salt)!==u.hash)return msg(m,"Password saat ini salah.");
  if(!okPw(pw))return msg(m,PW_RULE);
  if(pw===cur)return msg(m,"Password baru harus berbeda dari password lama.");
  if(pw!==pw2)return msg(m,"Konfirmasi password tidak sama.");
  u.salt=newSalt();u.hash=await hashPw(pw,u.salt);store.set(K.USERS,all);
  e.target.reset();msg(m,"Password berhasil diganti.",true);
});
$("logoutBtn").addEventListener("click",()=>{C.clearSession();C.go("masuk.html")});

/* ---------- Antrean kunjungan ---------- */
const queue=()=>store.get(K.QUEUE,[]);
function renderSlots(){
  const date=$("qDate").value,sel=$("qTime");
  if(!date){sel.innerHTML='<option value="">Pilih tanggal dulu</option>';return}
  const day=new Date(date+"T00:00:00").getDay();
  if(day===0||day===6){sel.innerHTML='<option value="">Pelayanan hanya Senin–Jumat</option>';return}
  const taken=queue().filter(x=>x.date===date&&x.status==="Aktif"),now=new Date(),isToday=date===iso(now);
  sel.innerHTML='<option value="">Pilih jam</option>'+SLOTS.map(t=>{
    const left=CAP-taken.filter(x=>x.time===t).length,past=isToday&&+t.slice(0,2)<=now.getHours();
    return `<option value="${t}" ${left<=0||past?"disabled":""}>${t} WIB (${past?"sudah lewat":left<=0?"penuh":"sisa "+left})</option>`;
  }).join("");
}
$("qDate").addEventListener("change",renderSlots);
$("qService").innerHTML='<option value="">Pilih layanan</option>'+Object.keys(window.LmjServices||{}).filter(k=>k!=="Jam & Alur Pelayanan").map(k=>`<option>${esc(k)}</option>`).join("");
$("queueForm").addEventListener("submit",e=>{
  e.preventDefault();const u=user(),m=$("queueMsg");if(!u)return;
  const service=$("qService").value,date=$("qDate").value,time=$("qTime").value;
  if(!service||!date||!time)return msg(m,"Lengkapi layanan, tanggal, dan jam.");
  const all=queue();
  if(all.some(x=>x.userId===u.id&&x.date===date&&x.status==="Aktif"))return msg(m,"Anda sudah punya antrean aktif pada tanggal ini.");
  if(all.filter(x=>x.date===date&&x.time===time&&x.status==="Aktif").length>=CAP){renderSlots();return msg(m,"Jam tersebut sudah penuh. Pilih jam lain.")}
  const code=`ANT-${date.replaceAll("-","")}-${String(all.filter(x=>x.date===date).length+1).padStart(3,"0")}`;
  all.push({id:Date.now(),code,userId:u.id,service,date,time,status:"Aktif"});store.set(K.QUEUE,all);
  e.target.reset();renderQueue();renderSlots();
  msg(m,`Antrean dibuat: ${code}. Tunjukkan kode ini kepada petugas.`,true);
});
function renderQueue(){
  const u=user();if(!u)return;
  const list=queue().filter(x=>x.userId===u.id).sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
  $("queueList").innerHTML=list.length?list.map(x=>`<div class="acct-item">
    <div><strong>${esc(x.code)}</strong><small>${esc(x.service)} • ${esc(fmtDate(x.date))}, ${esc(x.time)} WIB</small></div>
    <span class="acct-badge ${x.status==="Aktif"?"on":""}">${esc(x.status)}</span>
    ${x.status==="Aktif"?`<button type="button" class="acct-act" data-cancel="${x.id}">Batalkan</button>`:""}</div>`).join("")
    :'<p class="acct-empty">Belum ada antrean. Pilih layanan, tanggal, dan jam di atas.</p>';
}
$("queueList").addEventListener("click",e=>{
  const b=e.target.closest("[data-cancel]");if(!b||!confirm("Batalkan antrean ini?"))return;
  const all=queue(),q=all.find(x=>String(x.id)===b.dataset.cancel);
  if(q){q.status="Dibatalkan";store.set(K.QUEUE,all)}
  renderQueue();renderSlots();toast("Antrean dibatalkan.");
});

/* ---------- Berita tersimpan ---------- */
const bmKey=()=>"lumajang_bookmarks_"+sid();
const bookmarks=()=>user()?store.get(bmKey(),[]):[];
function bookmarkButton(id){
  const on=bookmarks().includes(id);
  return `<button type="button" class="bookmark-btn ${on?"on":""}" data-news="${id}" aria-pressed="${on}">${on?"★ Tersimpan":"☆ Simpan"}</button>`;
}
function renderBookmarks(){
  const ids=bookmarks(),items=getNews().filter(n=>ids.includes(n.id));
  $("bookmarkList").innerHTML=items.length?items.map(n=>`<div class="acct-item">
    <div><strong>${esc(n.title)}</strong><small>${esc(n.category)} • ${esc(n.date)}</small></div>
    <button type="button" class="acct-act" data-unsave="${n.id}">Hapus</button></div>`).join("")
    :'<p class="acct-empty">Belum ada berita tersimpan. Tekan “Simpan” pada kartu berita.</p>';
}
function toggleBookmark(id){
  const ids=bookmarks(),next=ids.includes(id)?ids.filter(x=>x!==id):[...ids,id];
  store.set(bmKey(),next);return next.includes(id);
}
document.addEventListener("click",e=>{
  const b=e.target.closest(".bookmark-btn");
  if(b){
    const on=toggleBookmark(+b.dataset.news);
    b.classList.toggle("on",on);b.setAttribute("aria-pressed",on);b.textContent=on?"★ Tersimpan":"☆ Simpan";return;
  }
  const r=e.target.closest("[data-unsave]");
  if(r){toggleBookmark(+r.dataset.unsave);renderBookmarks();renderNews()}
});

/* ---------- Integrasi halaman ---------- */
function renderNav(){
  const u=user(),b=$("navAuth");
  b.innerHTML=`<span class="nav-avatar">${esc(u.name.trim()[0].toUpperCase())}</span>${esc(u.name.split(" ")[0])}`;
}
function fillReporter(){
  const u=user(),n=$("reporterName"),p=$("reporterPhone");
  if(u){if(!n.value)n.value=u.name;if(!p.value)p.value=u.phone}
}
function afterAuth(){renderNav();fillReporter();renderMyReports();renderNews()}
$("navAuth").addEventListener("click",()=>{$("mainNav").classList.remove("open");openAccount()});
$("incidentForm").addEventListener("reset",()=>setTimeout(fillReporter));

window.LmjAuth={user,bookmarkButton,openAccount};
afterAuth();
const w=sessionStorage.getItem("lmj_welcome");if(w){sessionStorage.removeItem("lmj_welcome");toast(w)}
})();
