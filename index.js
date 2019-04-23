const { Client } = require('pg')
const fs = require('fs')
const JSONToCSV = require("json2csv").parse;
const FileSystem = require("fs");
/**
 * Project Constants
 */
const TUP_COUNT = 50; // Number of tuples in result relation

/**
 * DATABASE CONSTANTS
 */
const TABLES = ["TENKTUP1", "TENKTUP2"]
const FIELDS = [
    "unique1",
    "unique2",
    "two",
    "four",
    "ten",
    "twenty",
    "onepercent",
    "tenpercent",
    "twentypercent",
    "fiftypercent",
    "unique3",
    "evenonepercent",
    "oddonepercent",
    "stringu1",
    "stringu2",
    "string4"
];

/**
 * POSTGRES SCRIPTS TO
 *  1. DROP TABLE
 *  2. CREATE TABLE
 *  3. INSERT ROW
 */
const drop_table = (tableName) => `DROP TABLE IF EXISTS ${tableName}`;
const create_table = (tableName) => `CREATE TABLE IF NOT EXISTS ${tableName}
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

const insert_row = (tableName) => `INSERT INTO ${tableName}(
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


/**
 * HELPER FUNCTIONS / UTIL FUNCTIONS 
 */
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


const storeData = (data, path) => {
    try {
        var csv = JSONToCSV(data, { fields: FIELDS});
        FileSystem.writeFileSync(path, csv);    
    } catch (err) {
      console.error(err)
    }
  };
  
const range = (tupCount) => [...Array(tupCount).keys()];
const mod = (range, divisor) => [...range].map(x => x % divisor);
// const modString = (range, divisor) => range.map(x => x % divisor);
const getxChars = (length) => [...Array(length)].map(x => 'x');
const generateUniqueString = (_) => {
    const SIGNIFICANT_CHARS_LENGTH = 7;
    const X_CHARS_LENGTH = 45;
    const chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    const xChars = getxChars(X_CHARS_LENGTH);
    return [...Array(SIGNIFICANT_CHARS_LENGTH)].map(i=>chars[Math.random()*chars.length|0]).concat(xChars).join``;
};
const cyclicStrings = (range, divisor, strings) => {
    const X_CHARS_LENGTH = 48;
    const xChars = getxChars(X_CHARS_LENGTH);
    return range.map(i => strings[i % divisor].concat(xChars.join``));
}; 


/**
 * GENERATE DATA
 */

// candidate key, unique, random order
const unique1 = shuffle(range(TUP_COUNT));
// primary key, unique, sequential
const unique2 = range(TUP_COUNT);
// (unique1 mod 2)
const two = mod(unique1, 2);
// (unique1 mod 4)
const four = mod(unique1, 4);
// (unique1 mod 10)
const ten = mod(unique1, 10);
// (unique1 mod 20)
const twenty = mod(unique1, 20);
// (unique1 mod 100)
const onePercent = mod(unique1, 100);
// (unique1 mod 10)
const tenPercent = mod(unique1, 10);
// (unique1 mod 5)
const twentyPercent = mod(unique1, 5);
// (unique1 mod 2)
const fiftyPercent = mod(unique1, 2);
const unique3 = shuffle(range(TUP_COUNT));
// (onePercent * 2)
const evenOnePercent = onePercent.map(x => x * 2);
// (onePercent * 2)+1
const oddOnePercent = onePercent.map(x => (x * 2) + 1);
// candidate key
const stringu1 = unique2.map(generateUniqueString);
// candidate key
const stringu2 = [...stringu1].sort();
const string4 = cyclicStrings(unique2, 4, ["AAAA", "HHHH", "OOOO", "VVVV"]);

/**
 * GENERATE TUPLE
 */
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
    stringu1[index], 
    stringu2[index], 
    string4[index]
];

const dataset = unique2.map(generateTuple);

/**
 * INSERT DATA INTO POSTGRES
 */

const loadDataInRelation = (tableName) => {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'wisc',
        password: 'postgres',
        port: 5432,
      });
    
    client.connect();
    
    const DROP_TABLE = drop_table(tableName);
    const CREATE_TABLE = create_table(tableName);
    const INSERT_ROW = insert_row(tableName);
    const outputPath = `./${tableName}.csv`    
    client.query(DROP_TABLE)
        .then(_ => client.query(CREATE_TABLE))
        .then(_ => dataset.map(data => client.query(INSERT_ROW, data)))
        .then(_ => client.query('SELECT * FROM TENKTUP1'))
        .then(res => {
            console.log(res.rows);     
            storeData(res.rows, outputPath);    
            client.end();
        })
        .catch(e => console.error(e.stack))
};

TABLES.map(loadDataInRelation);  

