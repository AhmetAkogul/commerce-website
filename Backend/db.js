const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db",(err)=>{

if(err){
console.log(err);
}else{
console.log("SQLite bağlandı");
}

});

db.run(`
CREATE TABLE IF NOT EXISTS users(

id INTEGER PRIMARY KEY AUTOINCREMENT,

first_name TEXT NOT NULL,

last_name TEXT NOT NULL,

email TEXT UNIQUE NOT NULL,

password TEXT NOT NULL

)
`);

module.exports = db;