const { Client } = require('pg')

CREATE_TENKTUP1_TABLE = `CREATE TABLE IF NOT EXISTS TENKTUP1
                (   
                    unique1 integer NOT NULL,
                    unique2 integer NOT NULL PRIMARY KEY,
                    two integer NOT NULL,
                    four integer NOT NULL,
                    ten integer NOT NULL,
                    twenty integer NOT NULL,
                    onePercent integer NOT NULL,
                    tenPercent integer NOT NULL,
                    twentyPercent integer NOT NULL,
                    fiftyPercent integer NOT NULL,
                    unique3 integer NOT NULL,
                    evenOnePercent integer NOT NULL,
                    oddOnePercent integer NOT NULL,
                    stringu1 char(52) NOT NULL,
                    stringu2 char(52) NOT NULL,
                    string4 char(52) NOT NULL 
                )`;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'phoenix_react_curated_list_dev',
  password: 'postgres',
  port: 5432,
})

client.connect()

// const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
// const values = ['brianc2', 'brian2.m.carlson@gmail.com']

// client.query('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, email VARCHAR(40) not null)')
// .then(_ => client.query(text, values))

client.query(CREATE_TENKTUP1_TABLE)
    .then(_ => client.query('SELECT * FROM TENKTUP1'))
    .then(res => {console.log(res.rows); client.end()})
    .catch(e => console.error(e.stack))   

    














