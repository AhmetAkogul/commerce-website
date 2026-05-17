const express = require("express");
const cors = require("cors");

const login = require("./auth/login");
const register = require("./auth/register");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const rateLimitMap = {};

app.post("/login", rateLimit, verifyCaptcha, login.login);
app.post("/register", rateLimit, verifyCaptcha, register.register);


// frontendi aç
app.use(express.static(path.join(__dirname, "../Frontend")));




// rate limit fonksiyonu 10 saniyede 5 request
function rateLimit(req, res, next){

const ip = req.ip;
const now = Date.now();

if(!rateLimitMap[ip]){
    rateLimitMap[ip] = [];
}

// 10 saniyeden eski requestler siliniyo
rateLimitMap[ip] = rateLimitMap[ip].filter(
    time => now - time < 10000
);

// max 5 request
if(rateLimitMap[ip].length >= 5){
    return res.status(429).json({
        message: "Çok fazla istek attın 🚫"
    });
}

rateLimitMap[ip].push(now);

next();
}




// container içindeki ürünleri ekliyoruz burda

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./urunler.db");

//dbye urun ekleme
app.post("/add-product", (req, res) => {
    const { name, price, image, category, keywords } = req.body;

    if (!name || !price) {
        return res.status(400).json({ message: "Ürün adı ve fiyat zorunludur" });
    }

    db.run(`
        INSERT INTO urunler (name, price, image, category, keywords)
        VALUES (?, ?, ?, ?, ?)
    `, [name, price, image || "", category || "", keywords || ""], function(err) {
        if (err) {
            console.error("Ürün ekleme hatası:", err);
            return res.status(500).json({ message: "Ürün eklenirken sunucu hatası oluştu" });
        }
        res.json({ message: "Ürün başarıyla eklendi", id: this.lastID });
    });
});

// burası ai kısmının backend kısmı huggingface ai modeli kullanıyoruz

// ai başarısız kalırsa veya hızlı yanıt vermek için cevapları burdan cekecek
const AI_DESTEKLI_VERITABANI = [
    "erkek mont", "erkek bot", "erkek ayakkabı", "erkek tişört",
    "kadın mont", "kadın bot", "kadın çanta", "kadın elbise",
    "kışlık mont", "valiz", "ayakkabı", "spor ayakkabı",
    "adidas ayakkabı", "nike ayakkabı", "mekanik klavye",
    "oyuncu mouse", "oyuncu koltuğu", "bluetooth kulaklık", "webcam",
    "telefon kılıfı", "akıllı saat", "televizyon", "laptop",
    "çamaşır makinesi", "bulaşık makinesi", "buzdolabı", "kahve makinesi",
    "kitap", "defter", "kalem", "çalışma masası", "gözlük", "saat"
];


// rate limit fonksiyonunu burada kullanıyom fazla request atıp ai apisinden rate limit yemeyelim diye
app.post("/ai-autocomplete", rateLimit, async (req, res) => {

    const { text } = req.body;

    if (!text || text.length < 2) {
        return res.json({ öneri: "" });
    }

    const lowerText = text.toLowerCase();
    const localMatch = AI_DESTEKLI_VERITABANI.find(item => item.startsWith(lowerText));

    if (localMatch) {
        return res.json({ öneri: localMatch });
    }

    // promptu yazıyorum burası ai a soracak ve cevap alacak
    const prompt = `Task: Complete the e-commerce search query. Give ONLY 1 or 2 words.
    Input: erke
    Output: erkek mont
    Input: pija
    Output: pijama takımı
    Input: ${text}
    Output:`;

    try {
        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer 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",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "Qwen/Qwen2.5-72B-Instruct",
                    messages: [{role: "user", content: prompt}],
                    max_tokens: 5,
                    temperature: 0.1
                })
            }
        );

        const data = await response.json();
        let öneri = "";

        if (data.choices && data.choices[0]?.message?.content) {
            öneri = data.choices[0].message.content.trim().split('\n')[0].replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ ]/g, '').trim(); // sadece harfleri ve boşlukları al, gereksiz noktalama işaretlerini sil
        }

        // eger ai saçma bir şey ürettiyse veya inputla başlamıyorsa ghost text olarak kullanılamaz
        if (!öneri.toLowerCase().startsWith(lowerText)) {
            öneri = "";
        }

        res.json({ öneri });

    } catch (hata) {
        console.log("hata:", hata);
        res.json({ öneri: "" });
    }
});







// input arama fonksiyonu


app.post("/search-products", (req, res) => {

const text = req.body.text || "";
const searchText = text.toLowerCase();

db.all(`
SELECT * FROM urunler
WHERE 
LOWER(name) LIKE ?
OR LOWER(category) LIKE ?
OR LOWER(keywords) LIKE ?
`, [
    `%${searchText}%`,
    `%${searchText}%`,
    `%${searchText}%`
], (err, rows) => {

    if(err){
        console.log(err);
        return res.status(500).json({error:"DB hata"});
    }

    res.json(rows);

});

});












// CLOUDFLARE CAPTCHA FONKSIYONU
async function verifyCaptcha(req, res, next){

const token = req.body.captchaToken;

if(!token){
    return res.json({message: "Lütfen robot olmadığınızı doğrulayın"});
}

try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{
    method:"POST",
    headers:{
    "Content-Type":"application/x-www-form-urlencoded"
    },
    body: `secret=0x4AAAAAAC0mCIg9NHVPAtEj8l5bUV-QYAk&response=${token}`
    });

    const data = await response.json();

    if(data.success){
        next();
    } else {
        res.json({message: "Robot doğrulaması başarısız (Güvenlik İhlali)"});
    }
} catch(err) {
    res.json({message: "Captcha servisine ulaşılamadı"});
}

}







// 404 kısmı bu kısım en altta olmalı her zaman
app.use((req, res) => {
    res.status(404).sendFile(
        path.join(__dirname, "../Frontend/404.html")
    );
});
// --


app.listen(3000, () => {
    console.log("Backend çalışıyor 🚀 PORT 3000");
});