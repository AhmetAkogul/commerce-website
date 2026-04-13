const db = require("../db");

exports.login = (req,res)=>{

const {email,password} = req.body;

db.get(

"SELECT * FROM users WHERE email = ?",

[email],

(err,user)=>{

if(!user){
return res.json({message:"Kullanıcı bulunamadı"});
}

if(user.password !== password){
return res.json({message:"Şifre yanlış"});
}

res.json({
message:"Giriş başarılı",
user:user
});

}

);

};