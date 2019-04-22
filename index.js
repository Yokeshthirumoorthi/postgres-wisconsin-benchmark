const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'phoenix_react_curated_list_dev',
  password: 'postgres',
  port: 5432,
})
client.connect()

const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
const values = ['brianc2', 'brian2.m.carlson@gmail.com']

client.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, email VARCHAR(40) not null)')
    .then(_ => client.query(text, values))
    .then(_ => client.query('SELECT * FROM USERS'))
    .then(res => {console.log(res.rows); client.end()})
    .catch(e => console.error(e.stack))   
