// temayı localstoragede sakla ve her açılışta kontrol et
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}
darkTema();

function darkTema() {
  const darkMi = document.body.classList.contains("dark");
  temaBtn.textContent = darkMi ? "☀️" : "🌙";
  localStorage.setItem("theme", darkMi ? "dark" : "light");
}

temaBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkTema();
});



// navbar scroll ile gizlenip gösterilmesi
let sonScroll = 0;
const ustNavbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

let suAnkiScroll = window.scrollY;

if(suAnkiScroll > sonScroll){
  ustNavbar.classList.add("hide"); // ustNavbar.style.display = "none"/"fixed"; kullanınca transistion çalışmıyor
}
else{
  ustNavbar.classList.remove("hide");
}

sonScroll = suAnkiScroll;
});


//arama kutusu açma ve öneri gösterme  
const aramaKutusu = document.getElementById("aramaKutusu");
const input = document.querySelector(".anaAramaKutusu input");
const aramaKutusuInputu = document.getElementById("aramaKutusuInputu");
const sonuclar = document.getElementById("sonuclar");
const populerAramalar = document.querySelectorAll(".populerAramalar span");


// ürün listesi, gerçek projede bu veriyi backendden çekmeliyiz şu anlık deneme amaçlı sabit bir array kullandım
const products = [
"Bluetooth Kulaklık",
"Gaming Mouse",
"Mekanik Klavye",
"Mouse Pad",
"Kablosuz Mouse",
"RGB Klavye",
"Webcam",
"Oyuncu Kulaklığı"
];


// inputa basınca panel aç
input.addEventListener("click", () => {
aramaKutusu.style.display = "flex"; // cssde display:none flex yapıp açıyom
aramaKutusuInputu.value = input.value;
aramaKutusuInputu.focus();
});



// yazdıkça öneri
aramaKutusuInputu.addEventListener("input", () => {

let value = aramaKutusuInputu.value.toLowerCase();
sonuclar.innerHTML = "";

let filtrelenmisOneriler = products.filter(p => // bunlar şimdilik değişkenden geliyor backende bağlamayı unutma-----------------------------
  p.toLowerCase().includes(value) // includes true veya false döner
);

filtrelenmisOneriler.forEach(p => {
let div = document.createElement("div");

div.className = "resultItem";
div.textContent = p;

  div.onclick = () => {
    input.value = p;
    aramaKutusu.style.display = "none";
  };

sonuclar.appendChild(div);
  });
});



// dışarı tıklayınca kapanıcak
aramaKutusu.addEventListener("click", (e) => {

  if(e.target === aramaKutusu){
    aramaKutusu.style.display = "none";
  }
});




//entera basınca seçilen ürün inputa gelir ve panel kapanır
aramaKutusuInputu.addEventListener("keydown", (enterTusu) => {
if(enterTusu.key === "Enter"){

  input.value = aramaKutusuInputu.value;
  aramaKutusu.style.display = "none";
  }
});




// popüler ürünlere tıklayınca inputa gelir ve panel kapanır
populerAramalar.forEach(item => {
item.addEventListener("click", () => {

aramaKutusuInputu.value = item.textContent;
input.value = item.textContent;

aramaKutusu.style.display = "none";
  });
});



// dil desteği eklenecek,  dil seçimi yapıldığında localstoragede saklanacak ve her açılışta kontrol edilecek