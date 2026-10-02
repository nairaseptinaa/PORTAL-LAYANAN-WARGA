
if(sessionStorage.getItem("lumajang_admin_auth")==="1"){window.location.href="admin.html"}
document.getElementById("togglePassword").addEventListener("click",()=>{
 const p=document.getElementById("password"),btn=document.getElementById("togglePassword");
 p.type=p.type==="password"?"text":"password";btn.textContent=p.type==="password"?"Lihat":"Sembunyikan";
});
document.getElementById("loginForm").addEventListener("submit",e=>{
 e.preventDefault();
 const u=document.getElementById("username").value.trim(),p=document.getElementById("password").value;
 if(u==="admin"&&p==="Lumajang123!"){
   sessionStorage.setItem("lumajang_admin_auth","1");
   window.location.href="admin.html";
 }else{
   document.getElementById("loginError").textContent="Username atau password tidak sesuai.";
 }
});
