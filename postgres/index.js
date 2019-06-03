const { Client } = require('pg')
const wiscData = require('../wiscData')
const JSONToCSV = require("json2csv").parse;
const FileSystem = require("fs");
const array = require('lodash/array');

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
    "onePercent",
    "tenPercent",
    "twentyPercent",
    "fiftyPercent",
    "unique3",
    "evenOnePercent",
    "oddOnePercent",
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
            // json2csv(res.rows, outputPath);    
            client.end();
        })
        .catch(e => console.error(e.stack))
};


// console.log(wiscData.dataset_as_json);

// json2csv(wiscData.dataset_as_json, './TENKTUP1M.csv');
// dataset.map(data => client.query(INSERT_ROW, data));
// TABLES.map(loadDataInRelation);  
// loadDataInRelation("TENKTUP100K");
// loadDataInRelation("TENKTUP1M");


/**
 * INSERT DATA INTO PARALLEL POSTGRES
 */
const loadDataInRelation_Parallel =  (tableName, datachunk) => {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'wisc',
        password: 'postgres',
        port: 5432,
      });
    
    client.connect();

    const INSERT_ROW = insert_row(tableName);
    
    Promise.all(datachunk.map(data => client.query(INSERT_ROW, data)))
        .then(res => client.end())
        .catch(e => console.error(e.stack))
};

const setupdb = (tableName) => {
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
    client.query(DROP_TABLE)
        .then(_ => client.query(CREATE_TABLE))
        .then(_ => client.end())
        .catch(e => console.error(e.stack))
};

const do_parallel = (client_count) => {
    const DATA_COUNT = 1000;
    const CHUNK_SIZE = DATA_COUNT / client_count;
    const tableName = "TENKTUP1";
    setupdb(tableName);
    const start = new Date();
    return Promise.all(array.chunk(dataset, CHUNK_SIZE)
                        .map((chunk) => loadDataInRelation_Parallel(tableName, chunk)))
        .then(_ => {
                const end = new Date() - start;
                const total_time_sec = end / DATA_COUNT;
                const tps = DATA_COUNT / total_time_sec;
                console.log(client_count + ' clients --- TPS: %d', tps);
        })    
}

const SET_CLIENTS = [1, 2, 4, 8, 16, 32];

SET_CLIENTS.map(do_parallel);