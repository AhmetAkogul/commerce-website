const user = JSON.parse(localStorage.getItem("user"));
const adAlan = document.getElementById("kullaniciAdi");

if(!user){
    
    window.location.href = "login.html";
}
if(user){

    adAlan.textContent = user.first_name + " " + user.last_name;
}else{

    adAlan.textContent = "Giriş Yap";
}



const hesapKutusu = document.getElementById("hesapBox");
const menu = document.getElementById("hesapMenu");

/* aç / kapat */

hesapKutusu.addEventListener("click", (e)=>{
e.stopPropagation();
menu.classList.toggle("active");
});

/* dışarı tıklayınca kapat */

document.addEventListener("click", ()=>{
menu.classList.remove("active");
});

/* logout */

const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){
logoutBtn.addEventListener("click", (e)=>{
e.preventDefault();

localStorage.removeItem("user");

window.location.href = "login.html";
});
}