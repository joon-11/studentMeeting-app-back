const express = require('express')
const app = express()
const port = 3000
const db = require('./lib/db');
const mysql = require('mysql');

app.use(express.json());


// 교사 프로필 데이터 GET
app.get('/api/t_profiles', (req, res) => {
    const sql = 'SELECT t_no, t_name, t_lib, t_gender, t_exp FROM t_profile';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send(err);
        }
        console.log(results);
        res.json(results);
    });
});

// 온라인 예약 시스템 POST
app.post('/api/reserve', (req, res) => {
    const time = req.body.time;
    const person = req.body.person;
    const lib = req.body.lib;
    // const time = "2024-01-01 12:00:00";
    // const person = 1;
    const sqlInsert = 'INSERT INTO reserve (r_no, time, confirm, reserve_p, lib) VALUES (?, ?, ?, ?, ?)';
    const sqlSelectMaxRNo = 'SELECT COALESCE(MAX(r_no)+1, 1) AS next_r_no FROM reserve';
    
    db.query(sqlSelectMaxRNo, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        
        const nextRNo = result[0].next_r_no;
        db.query(sqlInsert, [nextRNo, time, 'y', person, lib], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json(results);
        });
    });
});


// 예약 취소 POST
app.post('/api/cancel', (req, res) => {
    // const person = req.body.person;
    const time = req.body.time;
    const person = 1;
    // const time = "2024-01-01 12:00:00";
    const sql = "update reserve set confirm = 'N' where reserve_p = ? and time = ?";

    db.query(sql,[person, time], (err, result)=>{
        if (err) {
            return res.status(500).send(err);
        }
        return res.json(result);
    });
});

//예약 확인 GET
app.get('/api/reserveConfirm', (req, res) => {
    const person = 1;
    const sql = "SELECT * FROM reserve WHERE reserve_p = ? AND confirm = 'y'";

    db.query(sql, [person], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "no selected" });
        }
        console.log(results);
        return res.json(results);
    });
});

app.get("api/loadReserve", (req, res) => {
    const sql = "SELECT * from "
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})