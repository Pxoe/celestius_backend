const express = require('express');
const app = express();
const PORT = 3000;
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');


const pool = new Pool({
    user: 'postgres',
    password: 'Harivansh123*',
    host: 'localhost',
    database: 'registration_db',
    port: 5432,
});

app.use(cors());
app.use(express.json());


app.get('/home', (req, res) => {
    res.send('<h1>REGISTRATION</h1>');
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const query = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING id';
        const result = await pool.query(query, [username, password]);

        res.status(201).json({
            message: 'Successfully registered user',
            userId: result.rows[0].id,
            username,
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed.' });
    }
});

app.listen(PORT, () => {
    console.log(`server is running in PORT: ${PORT}`);
});
