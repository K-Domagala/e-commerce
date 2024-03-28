const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'postgres',
    database: 'e-commerce'
});

client.connect();

module.exports = client