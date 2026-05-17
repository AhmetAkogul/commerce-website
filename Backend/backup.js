const fs = require('fs');
const path = require('path');

// Yedeklerin kaydedileceği klasör
const backupDir = path.join(__dirname, 'backups');

// Eğer backups klasörü yoksa oluştur
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
}

// Tarih formatını ayarla (Örn: 2026-05-17_13-40-22)
const date = new Date();
const timestamp = date.toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];

// Yedeklenecek veritabanı dosyaları (varsa daha fazla eklenebilir)
const databases = ['database.db', 'urunler.db'];

console.log('📦 Veritabanı yedekleme işlemi başlatılıyor...');

databases.forEach(dbName => {
    const sourcePath = path.join(__dirname, dbName);
    
    // Sadece var olan dosyaları yedekle
    if (fs.existsSync(sourcePath)) {
        const ext = path.extname(dbName);
        const name = path.basename(dbName, ext);
        const backupFileName = `${name}_backup_${timestamp}${ext}`;
        const destinationPath = path.join(backupDir, backupFileName);

        try {
            fs.copyFileSync(sourcePath, destinationPath);
            console.log(`✅ ${dbName} başarıyla yedeklendi -> backups/${backupFileName}`);
        } catch (err) {
            console.error(`❌ ${dbName} yedeklenirken hata oluştu:`, err);
        }
    } else {
        console.warn(`⚠️ ${dbName} dosyası bulunamadı, atlanıyor.`);
    }
});

console.log('🚀 Yedekleme işlemi tamamlandı.');
