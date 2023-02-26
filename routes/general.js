const express = require("express");
const router = express.Router();
require("dotenv").config();


//SQL Connection
const mysql = require("mysql");
const db = mysql.createPool({
    host: "sql658.main-hosting.eu",
    user: "u486424484_vynilsonline",
    password: "NitroS2021!",
    database: "u486424484_vynils"
});

db.getConnection(async (err) => {
    if (err) {
      console.log(err);
    } else{
        console.log("--Connected to DB--")
    }
});

//get last 12 vinyls on the db
router.get("/", async (req, res) => {
    let sql = `SELECT * FROM albums ORDER BY id DESC LIMIT 12`;

    db.query(sql, async function (err, rows){
        if (err) throw err
        else{
            res.json({albums: rows})    
        }
    })

})

router.post("/search", async (req, res) => {
    let sql = `SELECT * FROM albums WHERE CONCAT_WS (title, author, genre) LIKE "%${req.body.search}%"`

    db.query(sql, async function (err, rows){
        if (err) throw err
        else{
            res.json(rows)
        }
    })

})

router.post("/edit", async (req, res) => {

    let sql = `UPDATE albums SET title="${req.body.title}", author="${req.body.author}", genre="${req.body.genre}", info="${req.body.info}", price="${req.body.price}" WHERE id="${req.body.id}"`

    db.query(sql, async function (err, rows){
        if (err) throw err
        else{
            res.json({update: true})
        }
    })

})



module.exports = router;