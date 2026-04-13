const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("ileriwebproje/Backend/urunler.db", (err)=>{
    if(err){
        console.error("DB açılamadı:", err);
    }else{
        console.log("SQLite DB oluşturuldu ✅");
    }
});



db.serialize(()=>{

    db.run(`
        CREATE TABLE IF NOT EXISTS urunler (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price INTEGER,
            image TEXT,
            category TEXT,
            keywords TEXT
        )
    `, (err)=>{
        if(err){
            console.log("Tablo hatası:", err);
        }else{
            console.log("Products tablosu hazır ✅");
        }
    });

    /* örnek ürünler */
    const products = [
        ["Klavye Tuş Çıkartma Aparatı", 48.99, "https://cdn.dsmcdn.com/mnresize/620/920/ty1543/prod/QC/20240913/22/2b12b943-93f6-3669-aee9-d8be901333a5/1_org_zoom.jpg", "elektronik", "bluetooth kulaklık kablosuz müzik"]
    ];

    const stmt = db.prepare(`
        INSERT INTO urunler (name, price, image, category, keywords)
        VALUES (?, ?, ?, ?, ?)
    `);

    products.forEach(p => stmt.run(p));

    stmt.finalize();

    console.log("Örnek ürünler eklendi ✅");

});

db.close();