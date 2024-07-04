const express = require('express')
const app = express()
const port = 3000
const db = require('./lib/db');
const mysql = require('mysql');


// 교사 프로필 데이터 GET
app.get('/api/t_profiles', (req, res) => {
    const sql = 'SELECT * FROM t_profile';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send(err);
        }
        res.json(results);
    });
});

app.post('/api/reserve', (req, res) => {
    const time = req.body.time;
    const sqlInsert = 'INSERT INTO reserve (r_no, time, confrim) VALUES (?, ?, ?)';
    const sqlSelectMaxRNo = 'SELECT COALESCE(MAX(r_no)+1, 1) AS next_r_no FROM reserve';
    
    db.query(sqlSelectMaxRNo, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        
        const nextRNo = result[0].next_r_no;
        db.query(sqlInsert, [nextRNo, time, 'y'], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json(results);
        });
    });
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})