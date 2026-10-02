/* Inti akun warga — dipakai masuk.html dan index.html. SIMULASI frontend (localStorage). */
(()=>{
"use strict";
const K={USERS:"lumajang_users",SESS:"lumajang_session",QUEUE:"lumajang_queue",RESET:"lumajang_reset",LOCK:"lumajang_login_lock"};
const store={
  get:(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v===null?d:v}catch{return d}},
  set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))
};
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");
const newSalt=()=>hex(crypto.getRandomValues(new Uint8Array(12)));
async function hashPw(pw,salt){
  const data=new TextEncoder().encode(salt+pw);
  if(window.crypto&&crypto.subtle)return hex(await crypto.subtle.digest("SHA-256",data));
  let h=5381;for(const c of salt+pw)h=((h<<5)+h+c.charCodeAt(0))>>>0;
  return "x"+h;
}
const users=()=>store.get(K.USERS,[]);
const sid=()=>sessionStorage.getItem(K.SESS)||localStorage.getItem(K.SESS);
const user=()=>{const id=sid();return id?users().find(u=>u.id===id)||null:null};
function setSession(id,remember){
  sessionStorage.removeItem(K.SESS);localStorage.removeItem(K.SESS);
  (remember?localStorage:sessionStorage).setItem(K.SESS,id);
}
const clearSession=()=>{sessionStorage.removeItem(K.SESS);localStorage.removeItem(K.SESS)};
const okEmail=e=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const okPhone=p=>/^(08|\+628|628)\d{8,11}$/.test(p.replace(/[\s-]/g,""));
const okPw=p=>p.length>=8&&/[A-Za-z]/.test(p)&&/\d/.test(p);
const PW_RULE="Password minimal 8 karakter dan memuat huruf serta angka.";
function msg(el,text,ok){el.textContent=text||"";el.className="auth-msg"+(text?(ok?" ok":" err"):"")}
window.LmjCore={K,store,esc,newSalt,hashPw,users,sid,user,setSession,clearSession,okEmail,okPhone,okPw,PW_RULE,msg,go:u=>location.replace(u)};
})();
