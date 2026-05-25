const db = require("../db");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {

    const { first_name, last_name, email, password } = req.body;

    try {
        const encliSifre = await bcrypt.hash(password, 10);

        db.run(
            "INSERT INTO users (first_name,last_name,email,password) VALUES (?,?,?,?)",
            [first_name, last_name, email, encliSifre],
            function (err) {
                if (err) {
                    return res.json({ message: "Email zaten kayıtlı" });
                }
                res.json({ message: "Kayıt başarılı" });
            }
        );
    } catch (error) {
        console.error("Şifreleme hatası:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};