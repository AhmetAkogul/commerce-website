if (window.location.pathname.includes("login")) {
    document.querySelector("form").addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.querySelector("input[type=email]").value;
        const password = document.querySelector("input[type=password]").value;
        const captchaToken = document.querySelector('[name="cf-turnstile-response"]')?.value;

        if (!captchaToken) {
            uyariGoster("Lütfen robot olmadığınızı doğrulayın.");
            return;
        }

        fetch("http://localhost:3000/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password,
                captchaToken
            })

        })
            .then(res => res.json())
            .then(data => {

                if (data.message === "Giriş başarılı") {

                    //kullanıcıyı kaydet localstorageye kayıt ettik sonradan çekebilmek için

                    localStorage.setItem("user", JSON.stringify(data.user));
                    basariliGoster("Giriş Başarılı")
                    window.location.href = "anasayfa.html";

                } else {
                    uyariGoster(data.message);
                }

            })
            .catch(err => console.log(err));

    });
}
//--------------------------------------













if (window.location.pathname.includes("register")) {
    document.querySelector("form").addEventListener("submit", function (e) {

        e.preventDefault();

        const inputs = document.querySelectorAll("input");

        const first_name = inputs[0].value;
        const last_name = inputs[1].value;
        const email = inputs[2].value;
        const password = inputs[3].value;
        const passwordTekrar = inputs[4].value;
        const captchaToken = document.querySelector('[name="cf-turnstile-response"]')?.value;

        // şifre kontrol

        if (password !== passwordTekrar) {
            uyariGoster("Şifreler aynı değil");
            return;
        }

        if (!captchaToken) {
            uyariGoster("Lütfen robot olmadığınızı doğrulayın.");
            return;
        }

        fetch("http://localhost:3000/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
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

                if (data.message === "Kayıt başarılı") {

                    basariliGoster("Kayıt başarılı");
                    window.location.href = "login.html";

                } else {
                    uyariGoster(data.message);
                }

            })
            .catch(err => console.log(err));
    });
}





function uyariGoster(mesaj) {

    let kutu = document.getElementById("uyari");

    kutu.textContent = mesaj;
    kutu.style.display = "block";

    setTimeout(() => {
        kutu.style.display = "none";
    }, 3000);
}

// -----------------

function basariliGoster(mesaj) {

    let kutu = document.getElementById("basarili");

    kutu.textContent = mesaj;
    kutu.style.display = "block";

    setTimeout(() => {
        kutu.style.display = "none";
    }, 3000);
}




// ürünler.db den ürünleri çekeceğimiz yer 

async function loadAllProducts() {
    const urunlerKutusu = document.querySelector(".urunContainer");
    if (!urunlerKutusu) return;

    // URL'den arama parametresini al
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("search") || "";

    try {
        const res = await fetch("http://localhost:3000/search-products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: searchQuery })
        });

        const data = await res.json();
        
        // Eğer URL'de bir arama varsa bunu inputlara da yazalım
        if (searchQuery) {
            const anaInput = document.getElementById("searchInput");
            const modalInput = document.getElementById("aramaKutusuInputu");
            if (anaInput) anaInput.value = searchQuery;
            if (modalInput) modalInput.value = searchQuery;
        }

        if (data.length === 0) {
            urunlerKutusu.innerHTML = "<p style='color: white; text-shadow: 1px 2px 3px black; text-align: center; width: 100%; grid-column: 1 / -1;'>Ürün Bulunamadı</p>";
        } else {
            urunlerKutusu.innerHTML = data.map(item => `
            <div class="urunKart">
                <div class="img-wrapper">
                    <img src="${item.image}">
                </div>
                <h3>${item.name}</h3>
                <p>${item.price} TL</p>
                <button onclick="sepeteEkle(this.dataset.isim, this.dataset.fiyat, this.dataset.resim)" data-isim="${item.name}" data-fiyat="${item.price}" data-resim="${item.image}">Sepete Ekle</button>
            </div>
            `).join("");
        }
    } catch (error) {
        console.error("İlk ürünler yüklenemedi:", error);
    }
}

window.addEventListener("DOMContentLoaded", loadAllProducts);

if (window.location.pathname.includes("urunEkle")) {
    document.getElementById("urunEkleForm").addEventListener("submit", function (e) {
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










// Arama inputu için baştan oluşturulmuş arama fonksiyonu kaldırıldı.
// Artık arama işlemi sadece kullanıcı Enter'a bastığında veya öneriye tıkladığında
// app.js'teki yönlendirme ile URL parametresi üzerinden çalışıyor.








// --- SEPET İŞLEMLERİ ---

// Sepetimizi local storage'dan alıyoruz, yoksa boş dizi oluşturuyoruz
let sepet = JSON.parse(localStorage.getItem("sepet"));
if (!sepet) {
    sepet = [];
}

// Butona basıldığında sepete ürün ekleyen fonksiyon
window.sepeteEkle = function (isim, fiyat, resim) {
    let ayniUrunVarMi = false;

    // Sepette bu ürün zaten varsa sayısını 1 arttır
    for (let i = 0; i < sepet.length; i++) {
        if (sepet[i].isim === isim) {
            sepet[i].adet += 1;
            ayniUrunVarMi = true;
            break;
        }
    }

    // Sepette yoksa yeni bir ürün olarak ekle
    if (ayniUrunVarMi === false) {
        sepet.push({
            isim: isim,
            fiyat: parseFloat(fiyat),
            resim: resim,
            adet: 1
        });
    }

    // Yeni sepeti local storage'a kaydet
    localStorage.setItem("sepet", JSON.stringify(sepet));
    sepetiGuncelle();
}

// Sepetten ürünü silen fonksiyon
window.sepettenSil = function (index) {
    // İlgili sıradaki 1 ürünü siler
    sepet.splice(index, 1);
    localStorage.setItem("sepet", JSON.stringify(sepet));
    sepetiGuncelle();
}

// Sepet kutusunu ekranda çizen ve toplam fiyatı hesaplayan fonksiyon
window.sepetiGuncelle = function () {
    const sepetIcerik = document.getElementById("sepetIcerik");
    const sepetSayac = document.getElementById("sepetSayac");
    const sepetToplam = document.getElementById("sepetToplam");

    if (!sepetIcerik) return; // Sayfada sepet kutusu yoksa çalışma

    sepetIcerik.innerHTML = ""; // İçini temizle
    let toplamPara = 0;
    let toplamAdet = 0;

    // Ürünleri tek tek ekrana basıyoruz
    for (let i = 0; i < sepet.length; i++) {
        let urun = sepet[i];
        toplamPara += urun.fiyat * urun.adet;
        toplamAdet += urun.adet;

        sepetIcerik.innerHTML += `
            <div class="sepetItem">
                <img src="${urun.resim}" alt="">
                <div class="sepetItemDetay">
                    <p>${urun.isim}</p>
                    <b>${urun.fiyat} TL x ${urun.adet}</b>
                </div>
                <button class="sepetSilBtn" onclick="sepettenSil(${i})">X</button>
            </div>
        `;
    }

    // Sayacın görünüp gizlenmesi ayarları
    if (toplamAdet > 0) {
        if (sepetSayac) {
            sepetSayac.style.display = "inline-block";
            sepetSayac.textContent = toplamAdet;
        }
    } else {
        if (sepetSayac) {
            sepetSayac.style.display = "none";
        }
        sepetIcerik.innerHTML = "<p style='text-align:center; padding: 20px 0;'>Sepetiniz boş.</p>";
    }

    // Toplam parayı ekrana yazdır
    if (sepetToplam) {
        sepetToplam.textContent = toplamPara;
    }
}

// Sayfa yüklendiğinde sepet butonuna tıklama özelliğini ekliyoruz
document.addEventListener("DOMContentLoaded", function () {
    const sepetBtn = document.getElementById("sepetBtn");
    const sepetDropdown = document.getElementById("sepetDropdown");
    const sepetOnaylaBtn = document.getElementById("sepetOnaylaBtn");

    if (sepetBtn && sepetDropdown) {
        sepetBtn.addEventListener("click", function () {
            // Dropdown'ın açık kapalı olmasını değiştir (toggle)
            if (sepetDropdown.style.display === "flex") {
                sepetDropdown.style.display = "none";
            } else {
                sepetDropdown.style.display = "flex";
            }
        });
        sepetiGuncelle(); // Sayfa açılırken sepeti hemen çiz
    }

    if (sepetOnaylaBtn) {
        sepetOnaylaBtn.addEventListener("click", function () {
            let guncelSepet = JSON.parse(localStorage.getItem("sepet")) || [];
            if (guncelSepet.length === 0) {
                alert("Sepetiniz boş!");
                return;
            }
            window.location.href = "siparis.html";
        });
    }
});