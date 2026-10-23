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
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/register', async (req, res) => {
    const { name, email, department, time } = req.body;

    try {
        const query = 'INSERT INTO users(name, email, department) VALUES($1, $2, $3) RETURNING id';
        const countCheck = await pool.query('select count(*) from users');
        const totalRegistrations = parseInt(countCheck.rows[0].count);

        if(totalRegistrations>=50){
            return res.status(400).json({ error: 'Registration limit of 50 users has been reached.' })
        }

        const result = await pool.query(query, [name, email, department]);

        res.status(201).json({
            message: `Successfully registered ${name}`,
            userId: result.rows[0].id,
            name,
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed.' });
    }
});

app.get('/registrations/:id', async (req,res)=>{
    const{id} = req.params;
    const query = `select * from users where id = $1`;
    const result = await pool.query(query, [id]);
    res.status(200).json(result.rows[0]);

});
app.listen(PORT, () => {
    console.log(`server is running in PORT: ${PORT}`);
});
