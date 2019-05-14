const { Client } = require('pg')
const wiscData = require('../wiscData')
const JSONToCSV = require("json2csv").parse;
const FileSystem = require("fs");
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

const select_all_rows = (tableName) => `SELECT * FROM ${tableName}`;


// Converts json data to csv and save it in the out path
const json2csv = (data, path) => {
    try {
        var csv = JSONToCSV(data, { fields: FIELDS});
        FileSystem.writeFileSync(path, csv);    
    } catch (err) {
      console.error(err)
    }
  };
 

// colection of all tuples
const dataset = wiscData.dataset_as_relation;

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
    const SELECT_ALL_ROWS = select_all_rows(tableName);
    const outputPath = `./${tableName}.csv`    
    client.query(DROP_TABLE)
        .then(_ => client.query(CREATE_TABLE))
        .then(_ => dataset.map(data => client.query(INSERT_ROW, data)))
        .then(_ => client.query(SELECT_ALL_ROWS))
        .then(res => {
            // console.log(res.rows);     
            json2csv(res.rows, outputPath);    
            client.end();
        })
        .catch(e => console.error(e.stack))
};

TABLES.map(loadDataInRelation);  
