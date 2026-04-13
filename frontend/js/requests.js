if(window.location.pathname.includes("login")){
document.querySelector("form").addEventListener("submit",function(e){

e.preventDefault();

const email = document.querySelector("input[type=email]").value;
const password = document.querySelector("input[type=password]").value;
const captchaToken = document.querySelector('[name="cf-turnstile-response"]')?.value;

if (!captchaToken) {
    uyariGoster("Lütfen robot olmadığınızı doğrulayın.");
    return;
}

fetch("http://localhost:3000/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
password,
captchaToken
})

})
.then(res => res.json())
.then(data => {

if(data.message === "Giriş başarılı"){

    //kullanıcıyı kaydet localstorageye kayıt ettik sonradan çekebilmek için
    
    localStorage.setItem("user", JSON.stringify(data.user));
    basariliGoster("Giriş Başarılı")
    window.location.href = "anasayfa.html";

}else{
    uyariGoster(data.message);
}

})
.catch(err => console.log(err));

});
}
//--------------------------------------













if(window.location.pathname.includes("register")){
document.querySelector("form").addEventListener("submit", function(e){

e.preventDefault();

const inputs = document.querySelectorAll("input");

const first_name = inputs[0].value;
const last_name = inputs[1].value;
const email = inputs[2].value;
const password = inputs[3].value;
const passwordTekrar = inputs[4].value;
const captchaToken = document.querySelector('[name="cf-turnstile-response"]')?.value;

// şifre kontrol

if(password !== passwordTekrar){
    uyariGoster("Şifreler aynı değil");
    return;
}

if (!captchaToken) {
    uyariGoster("Lütfen robot olmadığınızı doğrulayın.");
    return;
}

fetch("http://localhost:3000/register",{

method:"POST",

headers:{
    "Content-Type":"application/json"
},

body:JSON.stringify({
    first_name,
    last_name,
    email,
    password,
    captchaToken
})

})
.then(res => res.json())
.then(data => {

console.log(data);

if(data.message === "Kayıt başarılı"){

    basariliGoster("Kayıt başarılı");
    window.location.href = "login.html";

}else{
    uyariGoster(data.message);
}

})
.catch(err => console.log(err));
});
}





function uyariGoster(mesaj){

let kutu = document.getElementById("uyari");

kutu.textContent = mesaj;
kutu.style.display = "block";

setTimeout(() => {
kutu.style.display = "none";
}, 3000);}

// -----------------

function basariliGoster(mesaj){

let kutu = document.getElementById("basarili");

kutu.textContent = mesaj;
kutu.style.display = "block";

setTimeout(() => {
kutu.style.display = "none";
}, 3000);}




// ürünler.db den ürünleri çekeceğimiz yer 

async function loadAllProducts() {
    const urunlerKutusu = document.querySelector(".urunContainer");
    if(!urunlerKutusu) return;
    
    try {
        const res = await fetch("http://localhost:3000/search-products",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({text:""})
        });

        const data = await res.json();

        urunlerKutusu.innerHTML = data.map(item => `
        <div class="urunKart">
            <div class="img-wrapper">
                <img src="${item.image}">
            </div>
            <h3>${item.name}</h3>
            <p>${item.price} TL</p>
            <button>Sepete Ekle</button>
        </div>
        `).join("");
    } catch (error) {
        console.error("İlk ürünler yüklenemedi:", error);
    }
}

window.addEventListener("DOMContentLoaded", loadAllProducts);

if(window.location.pathname.includes("urunEkle")){
    document.getElementById("urunEkleForm").addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("urunAdi").value;
        const price = document.getElementById("urunFiyati").value;
        const image = document.getElementById("urunGorseli").value;
        const category = document.getElementById("urunKategorisi").value;
        const keywords = document.getElementById("urunAnahtarKelimeler").value;

        fetch("http://localhost:3000/add-product", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, image, category, keywords })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Ürün başarıyla eklendi") {
                basariliGoster(data.message);
                document.getElementById("urunEkleForm").reset();
            } else {
                uyariGoster(data.message || "Bir hata oluştu");
            }
        })
        .catch(err => {
            console.error(err);
            uyariGoster("Sunucu ile bağlantı kurulamadı.");
        });
    });
}