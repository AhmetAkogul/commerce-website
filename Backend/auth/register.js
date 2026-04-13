const db = require("../db");

exports.register = (req,res)=>{

const {first_name,last_name,email,password} = req.body;

db.run(

"INSERT INTO users (first_name,last_name,email,password) VALUES (?,?,?,?)",

[first_name,last_name,email,password],

function(err){

if(err){
return res.json({message:"Email zaten kayıtlı"});
}

res.json({message:"Kayıt başarılı"});

}
);
};