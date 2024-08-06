var mysql = require('mysql2');
const fs = require('fs');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'schootMeeting'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

const filePath = 'backend/images/루피.webp';

fs.readFile(filePath, (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // 이미지 데이터를 BLOB으로 삽입
    const sql = 'UPDATE t_profile SET t_image = ? WHERE t_no = 1';
    db.query(sql, [data], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }

        if (result.affectedRows === 0) {
            console.log('No rows updated. Check if t_no = 0 exists.');
        } else {
            console.log('Image saved to database. Affected rows:', result.affectedRows);
        }
    });
});
