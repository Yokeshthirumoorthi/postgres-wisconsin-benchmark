# postgres-wisconsin-benchmark

[WIP]

Implementation of [Wisconsin Benchmark: Past, present and future](http://jimgray.azurewebsites.net/benchmarkhandbook/chapter4.pdf) using postgres database.

#### Work Description
This project provides nodejs script to generate data for benchmarking Postgres database based on the Wisconsin Benchmark
specification as described in the [paper]((http://jimgray.azurewebsites.net/benchmarkhandbook/chapter4.pdf)). 

To acheive this, initially a node project is initialized with node-postgres npm dependency package. node-postgres package is used to connect js client to PostgreSQL serve. 
In js, data is generated for each column, in compliance to the schema constraints and the rules defined in the paper. Finally all the column arrays are merged
based on indices to generate tuples/dataset. This in-memory dataset is iterated to insert each tuple into the database sequentially.  

After all the rows were inserted, a select query is execute for data verification and to save the sample output to a file.

#### Sample Data
Sample data (50 rows) generated using code generator is available here - [TENKTUP1](https://github.com/Yokeshthirumoorthi/postgres-wisconsin-benchmark/blob/master/TENKTUP1.csv) and here [TENKTUP2](https://github.com/Yokeshthirumoorthi/postgres-wisconsin-benchmark/blob/master/TENKTUP2.csv)

#### Software Stack

This project uses the following stack,
1. Node-JS
2. PostgreSQL

#### Why PostgreSQL

Reasons for choosing PostgreSQL are
* It is the most advanced open-source relational database in the world.
* It was created with the goal of being highly extensible.
* It is an object-relational database, meaning that although it's primarily a relational database it also includes features — like table inheritance and function overloading that are more often associated with object databases.
* Postgres is capable of efficiently handling concurrency.
* ACID compliant Transactions.

#### Lessons learned

Following are learned after doing this project
* How to use node based module for interfacing javascript with PostgresSQL.
* Points to be considered while generating synthetic data while benchmarking relational database.

#### Known Issues
* [node postgres module](https://node-postgres.com/) does not provide interface to create a new database in PostgresSQL. Hence it is required to manually create the database before executing the script.

#### Build Instructions

Disclaimer: This project is verified only in Ubuntu 18.04.

1. Prerequisites for build
    * Install latest Node version with this [instructions](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04) 
    * Install postgres with this [instructions](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04)

2. Setup the project

    ```bash
    git clone https://github.com/Yokeshthirumoorthi/postgres-wisconsin-benchmark.git
    cd postgres-wisconsin-benchmark
    ```
3. Generate and load data

    Note: Before executing the below lines, manually create a database with name `WISC` for user: postgres (default postgres user).

    ```bash
    npm install
    npm start
    ```
## Sending Feedback

We are always open to [your feedback](https://github.com/Yokeshthirumoorthi/postgres-wisconsin-benchmark/issues).

#### License

This program is licensed under the "MIT License". Please see the file LICENSE in the source distribution of this software for license terms.
