
const defaultNews=[
{id:1,title:"Pelayanan administrasi kecamatan kembali dibuka sesuai jam kerja",category:"pelayanan",date:"12 Agustus 2026",excerpt:"Masyarakat dapat memeriksa persyaratan terlebih dahulu sebelum datang ke kantor kecamatan."},
{id:2,title:"Kerja bakti lingkungan bersama warga dan perangkat wilayah",category:"kegiatan",date:"10 Agustus 2026",excerpt:"Kegiatan difokuskan pada kebersihan saluran, bahu jalan, dan fasilitas umum."},
{id:3,title:"Pengumuman pemutakhiran data pelayanan masyarakat",category:"pengumuman",date:"8 Agustus 2026",excerpt:"Warga diminta memastikan data kontak dan dokumen pendukung telah sesuai."},
{id:4,title:"Sosialisasi pemanfaatan kanal pelayanan digital",category:"pelayanan",date:"5 Agustus 2026",excerpt:"Portal digital membantu warga memperoleh informasi dasar sebelum mengakses layanan."},
{id:5,title:"Koordinasi kesiapsiagaan wilayah bersama unsur terkait",category:"kegiatan",date:"2 Agustus 2026",excerpt:"Koordinasi dilakukan untuk memperkuat komunikasi dan respons terhadap kebutuhan masyarakat."},
{id:6,title:"Imbauan menjaga kebersihan dan ketertiban lingkungan",category:"pengumuman",date:"30 Juli 2026",excerpt:"Masyarakat diimbau menjaga saluran air dan fasilitas umum."}
];


const defaultReports=[
{id:101,ticket:"LMG-2026-10421",name:"Siti Rahma",phone:"081234567801",category:"Jalan & Infrastruktur",location:"Jl. Gajah Mada, Lumajang",description:"Terdapat lubang jalan yang mulai melebar dan mengganggu pengendara.",priority:"Penting",status:"Diproses",createdAt:"10/08/2026 08.45.00"},
{id:102,ticket:"LMG-2026-20518",name:"Budi Santoso",phone:"081234567802",category:"Fasilitas Umum",location:"Sekitar Alun-Alun Lumajang",description:"Lampu penerangan di salah satu sisi fasilitas umum tidak menyala.",priority:"Normal",status:"Selesai",createdAt:"09/08/2026 19.10.00"},
{id:103,ticket:"LMG-2026-31840",name:"Nur Aini",phone:"081234567803",category:"Lingkungan",location:"Kelurahan Ditotrunan",description:"Saluran air tersumbat sampah setelah hujan.",priority:"Penting",status:"Baru",createdAt:"11/08/2026 13.25.00"},
{id:104,ticket:"LMG-2026-42167",name:"Agus Prasetyo",phone:"081234567804",category:"Keamanan & Ketertiban",location:"Kelurahan Jogoyudan",description:"Mohon tindak lanjut terkait penerangan area yang minim pada malam hari.",priority:"Normal",status:"Diproses",createdAt:"08/08/2026 20.05.00"},
{id:105,ticket:"LMG-2026-53792",name:"Dewi Lestari",phone:"081234567805",category:"Sosial",location:"Kelurahan Citrodiwangsan",description:"Permohonan informasi tindak lanjut pelayanan sosial warga.",priority:"Normal",status:"Selesai",createdAt:"07/08/2026 10.40.00"},
{id:106,ticket:"LMG-2026-64215",name:"Rizky Hidayat",phone:"081234567806",category:"Jalan & Infrastruktur",location:"Jl. Veteran, Lumajang",description:"Rambu di sisi jalan tertutup vegetasi dan sulit terlihat.",priority:"Penting",status:"Baru",createdAt:"12/08/2026 07.50.00"}
];
function ensureDummyReports(){
  const existing=JSON.parse(localStorage.getItem("lumajang_reports")||"[]");
  if(existing.length===0){
    localStorage.setItem("lumajang_reports",JSON.stringify(defaultReports));
  }
}
ensureDummyReports();

const services={
"Administrasi Kependudukan":{items:["KTP atau identitas pemohon","Kartu Keluarga","Dokumen pendukung perubahan data jika ada","Surat pengantar jika diwajibkan"],note:"Pastikan nama, NIK, dan data keluarga konsisten pada seluruh dokumen."},
"Surat Pengantar":{items:["Identitas pemohon","Kartu Keluarga bila diperlukan","Surat pengantar RT/RW atau kelurahan sesuai kebutuhan","Dokumen tujuan pengurusan"],note:"Jenis dokumen dapat berbeda sesuai tujuan surat."},
"Perizinan & Rekomendasi":{items:["Identitas pemohon","Surat permohonan","Dokumen kegiatan atau usaha","Dokumen pendukung sesuai jenis rekomendasi"],note:"Sesuaikan dengan SOP resmi kecamatan."},
"Layanan Sosial":{items:["Identitas pemohon","Kartu Keluarga","Surat pengantar wilayah jika diperlukan","Dokumen pendukung kondisi sosial"],note:"Persyaratan akhir mengikuti jenis pelayanan yang diajukan."},
"Jam & Alur Pelayanan":{items:["Datang pada jam pelayanan","Ambil atau ikuti antrean pelayanan","Serahkan dokumen kepada petugas","Simpan bukti penerimaan jika diberikan"],note:"Contoh jam pelayanan: Senin–Jumat 08.00–15.00 WIB. Ganti dengan jadwal resmi."}
};

window.LmjServices=services;
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function getNews(){let n=JSON.parse(localStorage.getItem("lumajang_news")||"null");if(!n){localStorage.setItem("lumajang_news",JSON.stringify(defaultNews));n=defaultNews}return n}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}

function renderNews(){
 const term=document.getElementById("newsSearch").value.toLowerCase(),filter=document.getElementById("newsFilter").value;
 const items=getNews().filter(n=>(n.title+" "+n.excerpt).toLowerCase().includes(term)&&(filter==="semua"||n.category===filter));
 document.getElementById("newsGrid").innerHTML=items.map(n=>`<article class="news-card">
   <div class="news-cover ${n.imageData?'has-image':''}" ${n.imageData?`style="background-image:linear-gradient(180deg,rgba(10,25,45,.10),rgba(10,25,45,.72)),url('${n.imageData}')"`:''}>
      <span>${escapeHtml(n.category.toUpperCase())}</span>
   </div>
   <div class="news-body">
      <div class="news-meta"><span>${escapeHtml(n.category)}</span><span>${escapeHtml(n.date)}</span></div>
      <h3>${escapeHtml(n.title)}</h3>
      <p>${escapeHtml(n.excerpt)}</p>
      ${window.LmjAuth?LmjAuth.bookmarkButton(n.id):''}
      ${n.documentData?`<a class="news-attachment" href="${n.documentData}" download="${escapeHtml(n.documentName||'lampiran')}">📎 Unduh lampiran</a>`:''}
   </div>
 </article>`).join("");
 document.getElementById("newsEmpty").classList.toggle("hidden",items.length>0)
}
document.getElementById("newsSearch").addEventListener("input",renderNews);
document.getElementById("newsFilter").addEventListener("change",renderNews);

document.getElementById("serviceSearch").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase();
 document.querySelectorAll(".service-card").forEach(card=>{
   card.style.display=(card.innerText+" "+card.dataset.keywords).toLowerCase().includes(q)?"block":"none";
 })
});

document.querySelectorAll("[data-service]").forEach(btn=>btn.addEventListener("click",()=>{
 const data=services[btn.dataset.service];
 document.getElementById("modalTitle").textContent=btn.dataset.service;
 document.getElementById("modalBody").innerHTML=`<p>Dokumen/persiapan umum:</p><ul>${data.items.map(i=>`<li>${escapeHtml(i)}</li>`).join("")}</ul><p><strong>Catatan:</strong> ${escapeHtml(data.note)}</p>`;
 document.getElementById("serviceModal").classList.remove("hidden");
}));
document.getElementById("modalClose").onclick=()=>document.getElementById("serviceModal").classList.add("hidden");
document.getElementById("serviceModal").addEventListener("click",e=>{if(e.target.id==="serviceModal")e.currentTarget.classList.add("hidden")});

window.demoDownload=function(name){toast(name+" masih berupa template demo. Ganti dengan PDF resmi kecamatan.")}


const incidentFormEl=document.getElementById("incidentForm");
const ticketInputEl=document.getElementById("ticketInput");
const ticketResultEl=document.getElementById("ticketResult");
const ticketActionsEl=document.getElementById("ticketActions");
const copyTicketBtnEl=document.getElementById("copyTicketBtn");
const whatsappTicketBtnEl=document.getElementById("whatsappTicketBtn");
const myReportsListEl=document.getElementById("myReportsList");

function getReports(){
  return JSON.parse(localStorage.getItem("lumajang_reports")||"[]");
}
function getMyTicketHistory(){
  const u=window.LmjAuth&&LmjAuth.user();
  if(u)return getReports().filter(r=>r.userId===u.id).map(r=>r.ticket).slice(0,5);
  return JSON.parse(localStorage.getItem("lumajang_my_tickets")||"[]");
}
function saveMyTicket(ticket){
  const history=getMyTicketHistory().filter(x=>x!==ticket);
  history.unshift(ticket);
  localStorage.setItem("lumajang_my_tickets",JSON.stringify(history.slice(0,5)));
}
function renderMyReports(){
  if(!myReportsListEl)return;
  const history=getMyTicketHistory();
  if(history.length===0){
    myReportsListEl.innerHTML='<div class="my-report-empty">Belum ada tiket tersimpan.</div>';
    return;
  }
  const reports=getReports();
  myReportsListEl.innerHTML=history.map(ticket=>{
    const r=reports.find(x=>String(x.ticket).toUpperCase()===String(ticket).toUpperCase());
    return `<button type="button" class="my-report-item" data-ticket="${escapeHtml(ticket)}">
      <span><strong>${escapeHtml(ticket)}</strong><small>${r?escapeHtml(r.category):"Laporan tersimpan"}</small></span>
      <b>${r?escapeHtml(r.status):"Cek"}</b>
    </button>`;
  }).join("");
  myReportsListEl.querySelectorAll(".my-report-item").forEach(btn=>{
    btn.addEventListener("click",()=>{
      ticketInputEl.value=btn.dataset.ticket;
      checkTicketStatus();
      document.getElementById("cekstatus").scrollIntoView({behavior:"smooth",block:"center"});
    });
  });
}

function getTicketMessage(ticket){
  const reports=getReports();
  const r=reports.find(x=>String(x.ticket).toUpperCase()===String(ticket).toUpperCase());
  if(!r){
    return `Nomor tiket laporan Kecamatan Lumajang: ${ticket}`;
  }
  return `Simpan nomor tiket laporan Kecamatan Lumajang:

Tiket: ${r.ticket}
Kategori: ${r.category}
Lokasi: ${r.location}
Status: ${r.status}

Gunakan tiket ini pada fitur Cek Status Laporan.`;
}

function showTicketActions(ticket){
  if(!ticketActionsEl)return;
  ticketActionsEl.dataset.ticket=ticket;
  ticketActionsEl.classList.remove("hidden");
}

function hideTicketActions(){
  if(ticketActionsEl){
    ticketActionsEl.dataset.ticket="";
    ticketActionsEl.classList.add("hidden");
  }
}

function checkTicketStatus(){
  const q=(ticketInputEl?.value||"").trim().toUpperCase();
  const reports=getReports();

  if(!q){
    ticketResultEl.textContent="Masukkan nomor tiket terlebih dahulu.";
    hideTicketActions();
    return;
  }

  const r=reports.find(x=>String(x.ticket).toUpperCase()===q);
  if(!r){
    ticketResultEl.innerHTML='Nomor tiket <strong>'+escapeHtml(q)+'</strong> tidak ditemukan pada browser ini.';
    hideTicketActions();
    return;
  }

  ticketResultEl.innerHTML=`Status: <strong>${escapeHtml(r.status)}</strong><br>
    Kategori: ${escapeHtml(r.category)}<br>
    Lokasi: ${escapeHtml(r.location)}<br>
    Dibuat: ${escapeHtml(r.createdAt)}`;
  saveMyTicket(r.ticket);
  showTicketActions(r.ticket);
  renderMyReports();
}

incidentFormEl.addEventListener("submit",e=>{
  e.preventDefault();

  const reporterNameEl=document.getElementById("reporterName");
  const reporterPhoneEl=document.getElementById("reporterPhone");
  const incidentCategoryEl=document.getElementById("incidentCategory");
  const incidentLocationEl=document.getElementById("incidentLocation");
  const incidentDescriptionEl=document.getElementById("incidentDescription");
  const incidentPriorityEl=document.getElementById("incidentPriority");

  const reports=getReports();
  const now=new Date();
  const ticket=`LMG-${now.getFullYear()}-${Math.floor(10000+Math.random()*89999)}`;

  const newReport={
    id:Date.now(),
    ticket,
    name:reporterNameEl.value.trim(),
    phone:reporterPhoneEl.value.trim(),
    category:incidentCategoryEl.value,
    location:incidentLocationEl.value.trim(),
    description:incidentDescriptionEl.value.trim(),
    priority:incidentPriorityEl.value,
    status:"Baru",
    userId:window.LmjAuth?((LmjAuth.user()||{}).id||null):null,
    createdAt:now.toLocaleString("id-ID")
  };

  reports.unshift(newReport);
  localStorage.setItem("lumajang_reports",JSON.stringify(reports));
  saveMyTicket(ticket);

  e.target.reset();
  ticketInputEl.value=ticket;
  ticketResultEl.innerHTML=`Laporan berhasil dibuat.<br>Nomor tiket: <strong>${escapeHtml(ticket)}</strong><br>Simpan nomor ini untuk pengecekan berikutnya.`;
  showTicketActions(ticket);
  renderMyReports();
  toast("Laporan berhasil dikirim.");
});

document.getElementById("checkTicketBtn").addEventListener("click",checkTicketStatus);
ticketInputEl.addEventListener("keydown",e=>{
  if(e.key==="Enter"){
    e.preventDefault();
    checkTicketStatus();
  }
});

copyTicketBtnEl.addEventListener("click",async()=>{
  const ticket=ticketActionsEl.dataset.ticket;
  if(!ticket)return;
  try{
    await navigator.clipboard.writeText(ticket);
    toast("Kode tiket berhasil disalin.");
  }catch(err){
    const temp=document.createElement("textarea");
    temp.value=ticket;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
    toast("Kode tiket berhasil disalin.");
  }
});

whatsappTicketBtnEl.addEventListener("click",()=>{
  const ticket=ticketActionsEl.dataset.ticket;
  if(!ticket)return;
  const text=encodeURIComponent(getTicketMessage(ticket));
  window.open(`https://wa.me/?text=${text}`,"_blank","noopener,noreferrer");
});

renderMyReports();


document.querySelectorAll(".faq-item button").forEach(b=>b.addEventListener("click",()=>b.parentElement.classList.toggle("open")));
document.getElementById("mobileToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));

const scrollBtn=document.getElementById("scrollTop");
window.addEventListener("scroll",()=>scrollBtn.classList.toggle("show",window.scrollY>500));
scrollBtn.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

document.getElementById("year").textContent=new Date().getFullYear();
renderNews();

document.querySelectorAll(".explore-tab").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".explore-tab").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".explore-panel").forEach(p=>p.classList.remove("active"));
    btn.classList.add("active");
    const panel=document.getElementById("explore-"+btn.dataset.explore);
    if(panel)panel.classList.add("active");
  });
});
