const { Client } = require('pg')

const TUP_COUNT = 50; // Number of tuples in result relation

const CREATE_TENKTUP1_TABLE = `CREATE TABLE IF NOT EXISTS TENKTUP1
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

const INSERT_TENKTUP1_ROW = `INSERT INTO TENKTUP1(
    unique1,
    unique2,
    two,
    four,
    ten,
    twenty,
    onePercent,
    tenPercent,
    twentyPercent,
    fiftyPercent,
    unique3,
    evenOnePercent,
    oddOnePercent,
    stringu1,
    stringu2,
    string4
    ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`;

// Ref : https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    
    return array;
}

const range = (tupCount) => [...Array(tupCount).keys()];
const mod = (range, divisor) => range.map(x => x % divisor);

const unique1 = shuffle(range(TUP_COUNT));
const unique2 = range(TUP_COUNT);
const two = mod(unique2, 2);
const four = mod(unique2, 4);
const ten = mod(unique2, 10);
const twenty = mod(unique2, 20);
const onePercent = mod(unique2, 100);
const tenPercent = mod(unique2, 10);
const twentyPercent = mod(unique2, 5);
const fiftyPercent = mod(unique2, 2);
const unique3 = shuffle(range(TUP_COUNT));
const evenOnePercent = onePercent.map(x => x * 2);
const oddOnePercent = onePercent.map(x => (x * 2) + 1);
const stringu1 = "TODO";
const stringu2 = "TODO";
const string4 = "TODO";

const generateTuple = (primaryKey, index) => [
    unique1[index], 
    primaryKey,
    two[index],
    four[index],
    ten[index],
    twenty[index],
    onePercent[index],
    tenPercent[index],
    twentyPercent[index],
    fiftyPercent[index],
    unique3[index],
    evenOnePercent[index],
    oddOnePercent[index],
    stringu1, stringu2, string4
];

const dataset = unique2.map(generateTuple);

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'phoenix_react_curated_list_dev',
    password: 'postgres',
    port: 5432,
  })  
client.connect()
client.query(CREATE_TENKTUP1_TABLE)
    .then(_ => dataset.map(data => client.query(INSERT_TENKTUP1_ROW, data)))
    .then(_ => client.query('SELECT * FROM TENKTUP1'))
    .then(res => {console.log(res.rows); client.end()})
    .catch(e => console.error(e.stack))   
