
if(sessionStorage.getItem("lumajang_admin_auth")!=="1"){window.location.replace("login.html")}


const defaultReports=[
{id:101,ticket:"LMG-2026-10421",name:"Siti Rahma",phone:"081234567801",category:"Jalan & Infrastruktur",location:"Jl. Gajah Mada, Lumajang",description:"Terdapat lubang jalan yang mulai melebar dan mengganggu pengendara.",priority:"Penting",status:"Diproses",createdAt:"10/08/2026 08.45.00"},
{id:102,ticket:"LMG-2026-20518",name:"Budi Santoso",phone:"081234567802",category:"Fasilitas Umum",location:"Sekitar Alun-Alun Lumajang",description:"Lampu penerangan di salah satu sisi fasilitas umum tidak menyala.",priority:"Normal",status:"Selesai",createdAt:"09/08/2026 19.10.00"},
{id:103,ticket:"LMG-2026-31840",name:"Nur Aini",phone:"081234567803",category:"Lingkungan",location:"Kelurahan Ditotrunan",description:"Saluran air tersumbat sampah setelah hujan.",priority:"Penting",status:"Baru",createdAt:"11/08/2026 13.25.00"},
{id:104,ticket:"LMG-2026-42167",name:"Agus Prasetyo",phone:"081234567804",category:"Keamanan & Ketertiban",location:"Kelurahan Jogoyudan",description:"Mohon tindak lanjut terkait penerangan area yang minim pada malam hari.",priority:"Normal",status:"Diproses",createdAt:"08/08/2026 20.05.00"},
{id:105,ticket:"LMG-2026-53792",name:"Dewi Lestari",phone:"081234567805",category:"Sosial",location:"Kelurahan Citrodiwangsan",description:"Permohonan informasi tindak lanjut pelayanan sosial warga.",priority:"Normal",status:"Selesai",createdAt:"07/08/2026 10.40.00"},
{id:106,ticket:"LMG-2026-64215",name:"Rizky Hidayat",phone:"081234567806",category:"Jalan & Infrastruktur",location:"Jl. Veteran, Lumajang",description:"Rambu di sisi jalan tertutup vegetasi dan sulit terlihat.",priority:"Penting",status:"Baru",createdAt:"12/08/2026 07.50.00"}
];
if(JSON.parse(localStorage.getItem("lumajang_reports")||"[]").length===0){
  localStorage.setItem("lumajang_reports",JSON.stringify(defaultReports));
}

const defaultNews=[
{id:1,title:"Pelayanan administrasi kecamatan kembali dibuka sesuai jam kerja",category:"pelayanan",date:"12 Agustus 2026",excerpt:"Masyarakat dapat memeriksa persyaratan terlebih dahulu sebelum datang ke kantor kecamatan."},
{id:2,title:"Kerja bakti lingkungan bersama warga dan perangkat wilayah",category:"kegiatan",date:"10 Agustus 2026",excerpt:"Kegiatan difokuskan pada kebersihan saluran, bahu jalan, dan fasilitas umum."}
];

let pendingAction=null;
let currentImageData=null;
let currentImageName="";
let currentDocumentData=null;
let currentDocumentName="";

let dashboardCurrentPage=1;
let reportsCurrentPage=1;

function pageSizeValue(selectEl){
  if(!selectEl || selectEl.value==="all") return Infinity;
  const n=Number(selectEl.value);
  return Number.isFinite(n) && n>0 ? n : 5;
}
function paginate(items,page,size){
  if(size===Infinity){
    return {items,totalPages:1,page:1,start:items.length?1:0,end:items.length};
  }
  const totalPages=Math.max(1,Math.ceil(items.length/size));
  const safePage=Math.min(Math.max(1,page),totalPages);
  const startIndex=(safePage-1)*size;
  return {
    items:items.slice(startIndex,startIndex+size),
    totalPages,
    page:safePage,
    start:items.length?startIndex+1:0,
    end:Math.min(startIndex+size,items.length)
  };
}
function updatePaginationUI(prefix,result,total){
  const info=document.getElementById(prefix+"PageInfo");
  const number=document.getElementById(prefix+"PageNumber");
  const prev=document.getElementById(prefix+"PrevBtn");
  const next=document.getElementById(prefix+"NextBtn");
  if(info) info.textContent=`${result.start}–${result.end} dari ${total} data`;
  if(number) number.textContent=`${result.page} / ${result.totalPages}`;
  if(prev) prev.disabled=result.page<=1;
  if(next) next.disabled=result.page>=result.totalPages;
}

function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function reports(){return JSON.parse(localStorage.getItem("lumajang_reports")||"[]")}
function saveReports(x){localStorage.setItem("lumajang_reports",JSON.stringify(x))}
function news(){
  let n=JSON.parse(localStorage.getItem("lumajang_news")||"null");
  if(!n){localStorage.setItem("lumajang_news",JSON.stringify(defaultNews));n=defaultNews}
  return n
}
function toast(m){
  const t=document.getElementById("toast");
  t.textContent=m;t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2200)
}
const statusBadge=s=>`<span class="status-badge status-${s}">${esc(s)}</span>`;
const prioBadge=s=>`<span class="priority-badge priority-${s}">${esc(s)}</span>`;

function updateStats(){
  const r=reports();
  statTotal.textContent=r.length;
  statNew.textContent=r.filter(x=>x.status==="Baru").length;
  statProcess.textContent=r.filter(x=>x.status==="Diproses").length;
  statDone.textContent=r.filter(x=>x.status==="Selesai").length;

  const size=pageSizeValue(document.getElementById("dashboardPageSize"));
  const paged=paginate(r,dashboardCurrentPage,size);
  dashboardCurrentPage=paged.page;

  latestReportsBody.innerHTML=paged.items.map(x=>`<tr>
    <td><strong>${esc(x.ticket)}</strong></td>
    <td>${esc(x.category)}</td>
    <td>${esc(x.location)}</td>
    <td>${prioBadge(x.priority)}</td>
    <td>${statusBadge(x.status)}</td>
  </tr>`).join("")||`<tr><td colspan="5">Belum ada laporan.</td></tr>`;

  updatePaginationUI("dashboard",paged,r.length);
}

function getFilteredReports(){
  const term=reportSearch.value.toLowerCase().trim();
  const status=statusFilter.value;
  return reports().filter(x=>{
    const haystack=(x.ticket+" "+x.name+" "+x.phone+" "+x.category+" "+x.location+" "+x.priority+" "+x.status+" "+x.description).toLowerCase();
    return haystack.includes(term)&&(status==="semua"||x.status===status);
  });
}

function updateExportSummary(items){
  const list=items||getFilteredReports();
  const elCount=document.getElementById("filteredCount");
  if(!elCount)return;
  elCount.textContent=list.length;
  document.getElementById("filteredNew").textContent=list.filter(x=>x.status==="Baru").length;
  document.getElementById("filteredProcess").textContent=list.filter(x=>x.status==="Diproses").length;
  document.getElementById("filteredDone").textContent=list.filter(x=>x.status==="Selesai").length;
}

function renderReports(){
  const items=getFilteredReports();
  const size=pageSizeValue(document.getElementById("reportsPageSize"));
  const paged=paginate(items,reportsCurrentPage,size);
  reportsCurrentPage=paged.page;

  reportsBody.innerHTML=paged.items.map(x=>`<tr>
    <td><strong>${esc(x.ticket)}</strong><br><small>${esc(x.createdAt)}</small></td>
    <td>${esc(x.name)}<br><small>${esc(x.phone)}</small></td>
    <td>${esc(x.category)}</td>
    <td>${esc(x.location)}</td>
    <td>${prioBadge(x.priority)}</td>
    <td>${statusBadge(x.status)}</td>
    <td><button class="table-action" onclick="openReport(${x.id})">Detail</button></td>
  </tr>`).join("")||`<tr><td colspan="7">Tidak ada laporan.</td></tr>`;

  updateExportSummary(items);
  updatePaginationUI("reports",paged,items.length);
}

window.openReport=id=>{
  const x=reports().find(r=>r.id===id);if(!x)return;
  reportDetail.innerHTML=`<div class="report-detail"><dl><dt>Tiket</dt><dd>${esc(x.ticket)}</dd><dt>Pelapor</dt><dd>${esc(x.name)} · ${esc(x.phone)}</dd><dt>Kategori</dt><dd>${esc(x.category)}</dd><dt>Lokasi</dt><dd>${esc(x.location)}</dd><dt>Urgensi</dt><dd>${prioBadge(x.priority)}</dd><dt>Status</dt><dd>${statusBadge(x.status)}</dd><dt>Waktu</dt><dd>${esc(x.createdAt)}</dd><dt>Kronologi</dt><dd>${esc(x.description)}</dd></dl><div class="status-controls"><button class="btn btn-ghost" onclick="setStatus(${x.id},'Baru')">Baru</button><button class="btn btn-ghost" onclick="setStatus(${x.id},'Diproses')">Diproses</button><button class="btn btn-primary" onclick="setStatus(${x.id},'Selesai')">Selesai</button></div></div>`;
  reportModal.classList.remove("hidden")
}
window.setStatus=(id,s)=>{
  const r=reports(),i=r.findIndex(x=>x.id===id);if(i<0)return;
  r[i].status=s;saveReports(r);updateStats();renderReports();openReport(id);toast("Status diperbarui.")
}
reportModalClose.onclick=()=>reportModal.classList.add("hidden");
reportModal.addEventListener("click",e=>{if(e.target.id==="reportModal")e.currentTarget.classList.add("hidden")});
reportSearch.addEventListener("input",()=>{reportsCurrentPage=1;renderReports()});
statusFilter.addEventListener("change",()=>{reportsCurrentPage=1;renderReports()});

document.getElementById("dashboardPageSize").addEventListener("change",()=>{
  dashboardCurrentPage=1;
  updateStats();
});
document.getElementById("dashboardPrevBtn").addEventListener("click",()=>{
  if(dashboardCurrentPage>1){dashboardCurrentPage--;updateStats()}
});
document.getElementById("dashboardNextBtn").addEventListener("click",()=>{
  dashboardCurrentPage++;
  updateStats();
});

document.getElementById("reportsPageSize").addEventListener("change",()=>{
  reportsCurrentPage=1;
  renderReports();
});
document.getElementById("reportsPrevBtn").addEventListener("click",()=>{
  if(reportsCurrentPage>1){reportsCurrentPage--;renderReports()}
});
document.getElementById("reportsNextBtn").addEventListener("click",()=>{
  reportsCurrentPage++;
  renderReports();
});

function showConfirm(title,message,action){
  confirmTitle.textContent=title;
  confirmMessage.textContent=message;
  pendingAction=action;
  confirmModal.classList.remove("hidden");
}
function closeConfirm(){
  confirmModal.classList.add("hidden");
  pendingAction=null;
}
confirmCancel.addEventListener("click",closeConfirm);
confirmModal.addEventListener("click",e=>{if(e.target.id==="confirmModal")closeConfirm()});
confirmProceed.addEventListener("click",()=>{
  if(typeof pendingAction==="function"){const fn=pendingAction;closeConfirm();fn()}
});

function renderNews(){
  adminNewsList.innerHTML=news().map(n=>`
    <div class="admin-news-item rich">
      <div class="admin-news-thumb ${n.imageData?'with-image':''}" ${n.imageData?`style="background-image:url('${n.imageData}')"`:''}>
        ${n.imageData?'':'◫'}
      </div>
      <div class="admin-news-copy">
        <strong>${esc(n.title)}</strong>
        <small>${esc(n.category)} · ${esc(n.date)}</small>
        ${n.documentName?`<span class="admin-attachment">📎 ${esc(n.documentName)}</span>`:''}
      </div>
      <div class="news-action-buttons">
        <button class="edit-btn" onclick="requestEditNews(${n.id})">Edit</button>
        <button class="delete-btn" onclick="requestDeleteNews(${n.id})">Hapus</button>
      </div>
    </div>`).join("")||"<p>Belum ada berita.</p>"
}

function fileToDataURL(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(reader.result);
    reader.onerror=reject;
    reader.readAsDataURL(file);
  });
}
function validateFile(file,allowedTypes){
  if(!file)return true;
  if(file.size>1.5*1024*1024){toast("Ukuran file maksimal 1,5 MB.");return false}
  if(allowedTypes && !allowedTypes.includes(file.type) && !file.name.match(/\.(doc|docx)$/i)){toast("Format file tidak didukung.");return false}
  return true;
}

newsImage.addEventListener("change",async e=>{
  const file=e.target.files[0];
  if(!file)return;
  if(!validateFile(file,["image/png","image/jpeg","image/webp"])){e.target.value="";return}
  currentImageData=await fileToDataURL(file);
  currentImageName=file.name;
  renderMediaPreview();
});
newsDocument.addEventListener("change",async e=>{
  const file=e.target.files[0];
  if(!file)return;
  if(!validateFile(file,["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"])){e.target.value="";return}
  currentDocumentData=await fileToDataURL(file);
  currentDocumentName=file.name;
  renderMediaPreview();
});

function renderMediaPreview(){
  if(!currentImageData && !currentDocumentData){
    mediaPreview.classList.add("hidden");
    mediaPreview.innerHTML="";
    return;
  }
  mediaPreview.classList.remove("hidden");
  mediaPreview.innerHTML=`
    ${currentImageData?`<div class="preview-image"><img src="${currentImageData}" alt="Preview"><button type="button" onclick="removeImage()">×</button><small>${esc(currentImageName)}</small></div>`:''}
    ${currentDocumentData?`<div class="preview-doc"><span>DOC</span><div><strong>${esc(currentDocumentName)}</strong><small>Lampiran siap disimpan</small></div><button type="button" onclick="removeDocument()">×</button></div>`:''}
  `;
}
window.removeImage=()=>{currentImageData=null;currentImageName="";newsImage.value="";renderMediaPreview()}
window.removeDocument=()=>{currentDocumentData=null;currentDocumentName="";newsDocument.value="";renderMediaPreview()}

newsForm.addEventListener("submit",e=>{
  e.preventDefault();
  const id=Number(editingNewsId.value||0);
  const payload={
    title:newsTitle.value.trim(),
    category:newsCategory.value,
    excerpt:newsExcerpt.value.trim(),
    imageData:currentImageData,
    imageName:currentImageName,
    documentData:currentDocumentData,
    documentName:currentDocumentName
  };
  const list=news();

  if(id){
    showConfirm("Simpan perubahan berita?","Perubahan akan menggantikan data berita yang tersimpan.",()=>{
      const idx=list.findIndex(x=>x.id===id);
      if(idx<0)return;
      list[idx]={...list[idx],...payload};
      localStorage.setItem("lumajang_news",JSON.stringify(list));
      resetNewsForm();
      renderNews();
      toast("Berita berhasil diperbarui.");
    });
  }else{
    list.unshift({
      id:Date.now(),
      ...payload,
      date:new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})
    });
    try{
      localStorage.setItem("lumajang_news",JSON.stringify(list));
      resetNewsForm();renderNews();toast("Berita dipublikasikan.");
    }catch(err){
      toast("Penyimpanan browser penuh. Gunakan file lebih kecil.");
    }
  }
});

window.requestEditNews=id=>{
  const item=news().find(x=>x.id===id);if(!item)return;
  showConfirm("Edit berita ini?","Data berita akan dimuat ke formulir edit. Anda masih dapat membatalkan sebelum menyimpan.",()=>{
    editingNewsId.value=item.id;
    newsTitle.value=item.title;
    newsCategory.value=item.category;
    newsExcerpt.value=item.excerpt;
    currentImageData=item.imageData||null;
    currentImageName=item.imageName||"";
    currentDocumentData=item.documentData||null;
    currentDocumentName=item.documentName||"";
    renderMediaPreview();
    newsSubmitBtn.textContent="Simpan Perubahan";
    cancelEditBtn.classList.remove("hidden");
    document.getElementById("newsForm").scrollIntoView({behavior:"smooth",block:"start"});
  });
}

window.requestDeleteNews=id=>{
  const item=news().find(x=>x.id===id);if(!item)return;
  showConfirm("Hapus berita ini?",`"${item.title}" akan dihapus dan tidak dapat dikembalikan dari browser ini.`,()=>{
    localStorage.setItem("lumajang_news",JSON.stringify(news().filter(x=>x.id!==id)));
    if(Number(editingNewsId.value)===id)resetNewsForm();
    renderNews();toast("Berita dihapus.");
  });
}

function resetNewsForm(){
  newsForm.reset();
  editingNewsId.value="";
  currentImageData=null;currentImageName="";
  currentDocumentData=null;currentDocumentName="";
  renderMediaPreview();
  newsSubmitBtn.textContent="Publikasikan";
  cancelEditBtn.classList.add("hidden");
}
cancelEditBtn.addEventListener("click",resetNewsForm);



/* ===== EXPORT LAPORAN INSTANSI ===== */
function reportRowsForExport(){
  return getFilteredReports().map((r,index)=>([
    index+1,
    r.ticket||"",
    r.createdAt||"",
    r.name||"",
    r.phone||"",
    r.category||"",
    r.location||"",
    r.priority||"",
    r.status||"",
    r.description||""
  ]));
}

const exportHeaders=["No","Nomor Tiket","Tanggal/Waktu","Nama Pelapor","No. WhatsApp","Kategori","Lokasi","Urgensi","Status","Kronologi / Detail"];

function safeFilenamePart(value){
  return String(value||"").replace(/[^a-z0-9_-]+/gi,"-").replace(/^-+|-+$/g,"").toLowerCase();
}
function exportBaseName(){
  const now=new Date();
  const date=now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0");
  const status=statusFilter.value==="semua"?"semua-status":safeFilenamePart(statusFilter.value);
  return `laporan-warga-kecamatan-lumajang-${status}-${date}`;
}
function triggerDownload(blob,filename){
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function xmlEscape(value){
  return String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
}

function exportExcel(){
  const rows=reportRowsForExport();
  if(rows.length===0){toast("Tidak ada data untuk diekspor.");return}
  const total=rows.length;
  const baru=rows.filter(r=>r[8]==="Baru").length;
  const proses=rows.filter(r=>r[8]==="Diproses").length;
  const selesai=rows.filter(r=>r[8]==="Selesai").length;
  const generated=new Date().toLocaleString("id-ID");
  const filterLabel=statusFilter.value==="semua"?"Semua status":statusFilter.value;
  const searchLabel=reportSearch.value.trim()||"-";

  // SpreadsheetML 2003: dibuka langsung oleh Microsoft Excel dan LibreOffice.
  const headerCells=exportHeaders.map(h=>`<Cell ss:StyleID="Header"><Data ss:Type="String">${xmlEscape(h)}</Data></Cell>`).join("");
  const dataRows=rows.map(row=>`<Row>${row.map((v,i)=>`<Cell ss:StyleID="${i===0?'Center':(i===9?'Wrap':'Body')}"><Data ss:Type="${i===0?'Number':'String'}">${xmlEscape(v)}</Data></Cell>`).join("")}</Row>`).join("");
  const xml=`<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Top"/><Font ss:FontName="Calibri" ss:Size="11"/></Style>
  <Style ss:ID="Title"><Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#173F3C"/></Style>
  <Style ss:ID="Meta"><Font ss:Color="#667A78" ss:Size="10"/></Style>
  <Style ss:ID="Header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#173F3C" ss:Pattern="Solid"/><Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#B9CBC6"/></Borders></Style>
  <Style ss:ID="Body"><Alignment ss:Vertical="Top"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8E5"/></Borders></Style>
  <Style ss:ID="Center"><Alignment ss:Horizontal="Center" ss:Vertical="Top"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8E5"/></Borders></Style>
  <Style ss:ID="Wrap"><Alignment ss:Vertical="Top" ss:WrapText="1"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8E5"/></Borders></Style>
  <Style ss:ID="KPI"><Font ss:Bold="1" ss:Color="#173F3C"/><Interior ss:Color="#E7F0EC" ss:Pattern="Solid"/></Style>
 </Styles>
 <Worksheet ss:Name="Laporan Warga">
  <Table>
   <Column ss:Width="38"/><Column ss:Width="115"/><Column ss:Width="115"/><Column ss:Width="115"/><Column ss:Width="100"/><Column ss:Width="130"/><Column ss:Width="165"/><Column ss:Width="75"/><Column ss:Width="80"/><Column ss:Width="280"/>
   <Row ss:Height="26"><Cell ss:MergeAcross="9" ss:StyleID="Title"><Data ss:Type="String">Laporan Warga Kecamatan Lumajang</Data></Cell></Row>
   <Row><Cell ss:MergeAcross="9" ss:StyleID="Meta"><Data ss:Type="String">Diekspor: ${xmlEscape(generated)} | Filter: ${xmlEscape(filterLabel)} | Pencarian: ${xmlEscape(searchLabel)}</Data></Cell></Row>
   <Row ss:Height="8"/>
   <Row><Cell ss:StyleID="KPI"><Data ss:Type="String">Total</Data></Cell><Cell ss:StyleID="KPI"><Data ss:Type="Number">${total}</Data></Cell><Cell ss:StyleID="KPI"><Data ss:Type="String">Baru</Data></Cell><Cell ss:StyleID="KPI"><Data ss:Type="Number">${baru}</Data></Cell><Cell ss:StyleID="KPI"><Data ss:Type="String">Diproses</Data></Cell><Cell ss:StyleID="KPI"><Data ss:Type="Number">${proses}</Data></Cell><Cell ss:StyleID="KPI"><Data ss:Type="String">Selesai</Data></Cell><Cell ss:StyleID="KPI"><Data ss:Type="Number">${selesai}</Data></Cell></Row>
   <Row ss:Height="8"/>
   <Row ss:Height="32">${headerCells}</Row>
   ${dataRows}
  </Table>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><FreezePanes/><FrozenNoSplit/><SplitHorizontal>5</SplitHorizontal><TopRowBottomPane>5</TopRowBottomPane><ActivePane>2</ActivePane><ProtectObjects>False</ProtectObjects><ProtectScenarios>False</ProtectScenarios></WorksheetOptions>
 </Worksheet>
</Workbook>`;
  triggerDownload(new Blob([xml],{type:"application/vnd.ms-excel;charset=utf-8"}),exportBaseName()+".xls");
  toast(`${rows.length} laporan diekspor ke Excel.`);
}

function csvCell(value){
  const s=String(value??"");
  return '"'+s.replace(/"/g,'""')+'"';
}
function exportCsv(){
  const rows=reportRowsForExport();
  if(rows.length===0){toast("Tidak ada data untuk diekspor.");return}
  const csv="\uFEFF"+[exportHeaders,...rows].map(row=>row.map(csvCell).join(";")).join("\r\n");
  triggerDownload(new Blob([csv],{type:"text/csv;charset=utf-8"}),exportBaseName()+".csv");
  toast(`${rows.length} laporan diekspor ke CSV.`);
}

function buildPrintReport(){
  const items=getFilteredReports();
  if(items.length===0){toast("Tidak ada data untuk dicetak.");return null}
  const baru=items.filter(x=>x.status==="Baru").length;
  const proses=items.filter(x=>x.status==="Diproses").length;
  const selesai=items.filter(x=>x.status==="Selesai").length;
  const tableRows=items.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.ticket)}</td><td>${esc(r.createdAt)}</td><td>${esc(r.name)}</td><td>${esc(r.category)}</td><td>${esc(r.location)}</td><td>${esc(r.priority)}</td><td>${esc(r.status)}</td><td>${esc(r.description)}</td></tr>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>Laporan Warga Kecamatan Lumajang</title><style>
  @page{size:A4 landscape;margin:12mm}body{font-family:Arial,sans-serif;color:#172a2b;margin:0}h1{font-size:20px;margin:0 0 4px}.meta{font-size:10px;color:#657; margin-bottom:12px}.kpis{display:flex;gap:8px;margin:10px 0 14px}.kpi{border:1px solid #cfd9d5;padding:7px 11px;border-radius:7px;font-size:10px}.kpi b{font-size:15px;color:#173f3c}table{width:100%;border-collapse:collapse;font-size:8.5px}th{background:#173f3c;color:white;text-align:left;padding:6px}td{border-bottom:1px solid #dfe6e3;padding:5px;vertical-align:top}tr:nth-child(even) td{background:#f6f8f6}.footer{margin-top:12px;font-size:8px;color:#7b8987}@media print{button{display:none}}</style></head><body>
  <h1>Laporan Warga Kecamatan Lumajang</h1><div class="meta">Dicetak ${new Date().toLocaleString("id-ID")} | Status: ${esc(statusFilter.value==="semua"?"Semua":statusFilter.value)} | Pencarian: ${esc(reportSearch.value.trim()||"-")}</div>
  <div class="kpis"><div class="kpi">Total<br><b>${items.length}</b></div><div class="kpi">Baru<br><b>${baru}</b></div><div class="kpi">Diproses<br><b>${proses}</b></div><div class="kpi">Selesai<br><b>${selesai}</b></div></div>
  <table><thead><tr><th>No</th><th>Tiket</th><th>Waktu</th><th>Pelapor</th><th>Kategori</th><th>Lokasi</th><th>Urgensi</th><th>Status</th><th>Kronologi</th></tr></thead><tbody>${tableRows}</tbody></table>
  <div class="footer">Dokumen hasil ekspor Portal Kecamatan Lumajang.</div><script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>`;
}
function printReport(){
  const html=buildPrintReport();if(!html)return;
  const w=window.open("","_blank");
  if(!w){toast("Popup diblokir browser. Izinkan popup untuk mencetak.");return}
  w.document.open();w.document.write(html);w.document.close();
}

async function shareReport(){
  const items=getFilteredReports();
  if(items.length===0){toast("Tidak ada data untuk dibagikan.");return}
  const summary=`Rekap Laporan Warga Kecamatan Lumajang\nTotal: ${items.length}\nBaru: ${items.filter(x=>x.status==="Baru").length}\nDiproses: ${items.filter(x=>x.status==="Diproses").length}\nSelesai: ${items.filter(x=>x.status==="Selesai").length}\nFilter status: ${statusFilter.value==="semua"?"Semua":statusFilter.value}\nPencarian: ${reportSearch.value.trim()||"-"}`;
  if(navigator.share){
    try{await navigator.share({title:"Rekap Laporan Warga Kecamatan Lumajang",text:summary});return}catch(err){if(err.name==="AbortError")return}
  }
  try{await navigator.clipboard.writeText(summary);toast("Ringkasan disalin. Siap ditempel ke WhatsApp/email.")}
  catch(err){toast("Browser tidak mendukung fitur bagikan.")}
}

const exportExcelBtn=document.getElementById("exportExcelBtn");
if(exportExcelBtn){
  exportExcelBtn.addEventListener("click",exportExcel);
  document.getElementById("exportCsvBtn").addEventListener("click",exportCsv);
  document.getElementById("printReportBtn").addEventListener("click",printReport);
  document.getElementById("shareReportBtn").addEventListener("click",shareReport);
}

document.querySelectorAll(".admin-menu").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".admin-menu").forEach(b=>b.classList.remove("active"));
  document.querySelectorAll(".admin-tab").forEach(t=>t.classList.remove("active"));
  btn.classList.add("active");
  const tab=btn.dataset.tab;
  document.getElementById("tab-"+tab).classList.add("active");
  adminTitle.textContent=tab==="dashboard"?"Dashboard":tab==="reports"?"Laporan Warga":"Kelola Berita";
  if(tab==="reports")renderReports();
  if(tab==="news")renderNews();
}));
logoutBtn.addEventListener("click",()=>{sessionStorage.removeItem("lumajang_admin_auth");window.location.href="login.html"});

updateStats();
renderReports();
renderNews();
