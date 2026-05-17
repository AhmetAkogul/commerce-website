document.addEventListener("DOMContentLoaded", function () {
    const siparisUrunler = document.getElementById("siparisUrunler");
    const araToplamDeger = document.getElementById("araToplamDeger");
    const genelToplamDeger = document.getElementById("genelToplamDeger");
    const onaylaBtn = document.getElementById("onaylaBtn");
    const siparisForm = document.getElementById("siparisForm");
    
    // Sepet verisini localStorage'dan al
    let sepet = JSON.parse(localStorage.getItem("sepet")) || [];
    
    // Sepet boşsa anasayfaya yönlendir
    if (sepet.length === 0) {
        alert("Sepetiniz boş! Alışverişe yönlendiriliyorsunuz.");
        window.location.href = "anasayfa.html";
        return;
    }

    // Sepet ürünlerini ekrana getir
    let toplamPara = 0;
    siparisUrunler.innerHTML = "";
    
    sepet.forEach(urun => {
        toplamPara += urun.fiyat * urun.adet;
        
        siparisUrunler.innerHTML += `
            <div class="siparisUrunItem">
                <img src="${urun.resim}" alt="${urun.isim}">
                <div class="siparisUrunDetay">
                    <p>${urun.isim}</p>
                    <span>${urun.fiyat} TL</span>
                </div>
                <div class="siparisUrunAdet">
                    ${urun.adet} Adet
                </div>
            </div>
        `;
    });

    araToplamDeger.textContent = toplamPara + " TL";
    genelToplamDeger.textContent = toplamPara + " TL";

    onaylaBtn.addEventListener("click", function(e) {
        e.preventDefault();

        // Form validasyonu (basit düzeyde)
        const adSoyad = document.querySelector('input[name="adSoyad"]')?.value;
        const telefon = document.querySelector('input[name="telNo"]')?.value;
        const adres = document.querySelector('textarea[name="adres"]')?.value;
        const kartIsim = document.querySelector('input[name="kartİsim"]')?.value;
        const kartNo = document.querySelector('input[name="kartNo"]')?.value;
        const skt = document.querySelector('input[name="sonKullanma"]')?.value;
        const cvv = document.querySelector('input[name="cvv"]')?.value;

        if(!adSoyad || !telefon || !adres || !kartIsim || !kartNo || !skt || !cvv) {
            uyariGoster("Lütfen tüm alanları doldurunuz!");
            return;
        }

        // Simülasyon: Sipariş başarılı
        basariliGoster("Siparişiniz başarıyla alındı! Yönlendiriliyorsunuz...");
        
        // Sepeti temizle
        localStorage.removeItem("sepet");

        // 3 saniye sonra anasayfaya dön
        setTimeout(() => {
            window.location.href = "anasayfa.html";
        }, 3000);
    });

    function uyariGoster(mesaj) {
        const kutu = document.getElementById("uyari");
        kutu.textContent = mesaj;
        kutu.style.display = "block";
        setTimeout(() => {
            kutu.style.display = "none";
        }, 3000);
    }

    function basariliGoster(mesaj) {
        const kutu = document.getElementById("basarili");
        kutu.textContent = mesaj;
        kutu.style.display = "block";
        setTimeout(() => {
            kutu.style.display = "none";
        }, 3000);
    }
});
