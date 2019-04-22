const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'phoenix_react_curated_list_dev',
  password: 'postgres',
  port: 5432,
})
client.connect()

client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
})