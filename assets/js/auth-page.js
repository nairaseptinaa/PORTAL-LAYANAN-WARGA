/* Halaman masuk.html: Masuk / Daftar / Lupa password */
(()=>{
"use strict";
const C=LmjCore,$=id=>document.getElementById(id),{msg,K,store}=C;
if(C.user()){C.go("index.html");return}

function done(name,verb){
  sessionStorage.setItem("lmj_welcome",`${verb}, ${name.split(" ")[0]}.`);
  C.go("index.html");
}
function showView(v){
  document.querySelectorAll(".auth-view").forEach(f=>f.classList.toggle("hidden",f.dataset.view!==v));
  document.querySelectorAll(".auth-tabs button").forEach(b=>{const on=b.dataset.view===v;b.classList.toggle("active",on);b.setAttribute("aria-selected",on)});
  $("authTabs").classList.toggle("hidden",v==="forgot"||v==="reset");
  document.querySelectorAll(".auth-msg").forEach(m=>msg(m,""));
  const f=document.querySelector(`.auth-view[data-view="${v}"] input`);if(f)setTimeout(()=>f.focus(),40);
}
document.querySelectorAll("button[data-view]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
document.querySelectorAll(".pw-toggle").forEach(b=>b.addEventListener("click",()=>{
  const i=b.previousElementSibling;i.type=i.type==="password"?"text":"password";
  b.textContent=i.type==="password"?"Lihat":"Sembunyikan";
}));

/* Daftar */
$("registerForm").addEventListener("submit",async e=>{
  e.preventDefault();const m=$("registerMsg");
  const name=$("regName").value.trim(),email=$("regEmail").value.trim().toLowerCase(),
        phone=$("regPhone").value.trim(),pw=$("regPw").value,pw2=$("regPw2").value;
  if(name.length<3)return msg(m,"Nama lengkap minimal 3 karakter.");
  if(!C.okEmail(email))return msg(m,"Format email belum benar.");
  if(!C.okPhone(phone))return msg(m,"Nomor WhatsApp harus diawali 08 dan terdiri dari 10–13 digit.");
  if(!C.okPw(pw))return msg(m,C.PW_RULE);
  if(pw!==pw2)return msg(m,"Konfirmasi password tidak sama.");
  if(C.users().some(u=>u.email===email))return msg(m,"Email sudah terdaftar. Silakan masuk.");
  const salt=C.newSalt();
  const u={id:"u"+Date.now(),name,email,phone,salt,hash:await C.hashPw(pw,salt),createdAt:new Date().toISOString()};
  store.set(K.USERS,[...C.users(),u]);C.setSession(u.id,false);done(name,"Akun berhasil dibuat. Selamat datang");
});

/* Masuk (5x gagal -> kunci 60 detik) */
$("loginUserForm").addEventListener("submit",async e=>{
  e.preventDefault();const m=$("loginUserMsg");
  const email=$("loginEmail").value.trim().toLowerCase(),pw=$("loginPw").value;
  const lock=store.get(K.LOCK,{}),l=lock[email]||{count:0,until:0};
  if(l.until>Date.now())return msg(m,`Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil((l.until-Date.now())/1000)} detik.`);
  const u=C.users().find(x=>x.email===email);
  if(u&&await C.hashPw(pw,u.salt)===u.hash){
    delete lock[email];store.set(K.LOCK,lock);
    C.setSession(u.id,$("loginRemember").checked);return done(u.name,"Selamat datang kembali");
  }
  l.count++;if(l.count>=5){l.until=Date.now()+60000;l.count=0}
  lock[email]=l;store.set(K.LOCK,lock);msg(m,"Email atau password salah.");
});

/* Lupa password */
let resetEmail="";
$("forgotForm").addEventListener("submit",e=>{
  e.preventDefault();const email=$("forgotEmail").value.trim().toLowerCase();
  if(!C.okEmail(email))return msg($("forgotMsg"),"Format email belum benar.");
  resetEmail=email;const demo=$("resetDemoCode");demo.classList.add("hidden");
  if(C.users().some(u=>u.email===email)){
    const code=String(Math.floor(100000+Math.random()*900000));
    store.set(K.RESET,{email,code,exp:Date.now()+10*60000,tries:0});
    demo.innerHTML=`Mode demo — kode verifikasi: <strong>${code}</strong><br><small>Pada versi produksi, kode dikirim ke email.</small>`;
    demo.classList.remove("hidden");
  }
  showView("reset");
  msg($("resetMsg"),"Jika email terdaftar, kode verifikasi 6 digit telah dibuat. Berlaku 10 menit.",true);
});
$("resetForm").addEventListener("submit",async e=>{
  e.preventDefault();const m=$("resetMsg");
  const code=$("resetCode").value.trim(),pw=$("resetPw").value,pw2=$("resetPw2").value;
  const r=store.get(K.RESET,null);
  if(!r||r.email!==resetEmail||r.exp<Date.now())return msg(m,"Kode tidak valid atau sudah kedaluwarsa. Minta kode baru.");
  if(r.tries>=5){localStorage.removeItem(K.RESET);return msg(m,"Terlalu banyak percobaan. Minta kode baru.")}
  if(code!==r.code){r.tries++;store.set(K.RESET,r);return msg(m,"Kode verifikasi salah.")}
  if(!C.okPw(pw))return msg(m,C.PW_RULE);
  if(pw!==pw2)return msg(m,"Konfirmasi password tidak sama.");
  const all=C.users(),u=all.find(x=>x.email===resetEmail);
  u.salt=C.newSalt();u.hash=await C.hashPw(pw,u.salt);store.set(K.USERS,all);
  localStorage.removeItem(K.RESET);
  const lock=store.get(K.LOCK,{});delete lock[resetEmail];store.set(K.LOCK,lock);
  e.target.reset();showView("login");
  msg($("loginUserMsg"),"Password berhasil diubah. Silakan masuk dengan password baru.",true);
});
})();
