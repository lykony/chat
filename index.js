const mysql = require('mysql2/promise');
const express = require('express');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'chat'
});

const app = express();
app.use(express.static('static'))

app.get('/', (req, res) => {
    return res.end('/static/index.html')
})

app.get('/messages', async (req, res) => {
    try {
        const connection = await pool.getConnection()
        const [rows, fields] = await connection.execute(`SELECT * FROM message`);
        connection.release();
        let html = '<html><body><ul>';
        rows.forEach(f => html += `<li>${f.content}</li>`);
        html += '</ul></body></html>';
        res.send(html)
    } catch(err) {
        connection.release();
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
    
});

app.get('/users', async (req, res) => {
    try {
        const connection = await pool.getConnection()
        const [rows, fields] = await connection.execute(`SELECT * FROM user`);
        connection.release();
        let html = '<html><body><ul>';
        rows.forEach(f => html += `<li>${f.login}</li>`);
        html += '</ul></body></html>';
        res.send(html)
    } catch(err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000)

// connection.query(`INSERT INTO message(content, author_id, dialog_id) VALUES('Що робиш', '3', '12')`,
//     (err, results, fields) => {
//         console.log(results)
//     });
