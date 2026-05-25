const db = require("../db");
const bcrypt = require("bcrypt");

exports.login = (req, res) => {

    const { email, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {

            if (!user) {
                return res.json({ message: "Kullanıcı bulunamadı" });
            }

            try {
                // şifre benc ile enclenmişse 2b ile başlayacağı icin kontrol ediyoruz başlamıyosa eski sistem girişe yönlendiriyoruz
                if (user.password.startsWith("$2b$") || user.password.startsWith("$2a$")) {
                    const match = await bcrypt.compare(password, user.password);
                    if (!match) {
                        return res.json({ message: "Şifre yanlış" });
                    }
                } else {
                    // Eski kayıtlı düz metin şifreler için kontrol
                    if (user.password !== password) {
                        return res.json({ message: "Şifre yanlış" });
                    }
                }

                res.json({
                    message: "Giriş başarılı",
                    user: user
                });
            } catch (error) {
                console.error("Giriş şifre kontrol hatası:", error);
                res.status(500).json({ message: "Sunucu hatası" });
            }

        }
    );

};