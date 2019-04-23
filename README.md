# postgres-wisconsin-benchmark

[WIP]

Implementation of Wisconsin Benchmark: Past, present and future using postgres database.

#### Work Description
I have written nodejs scripts to generate data for benchmarking Postgres database based on the Wisconsin Benchmark
specification as described in the paper. The data generation code creates tables and loads the required data directly into 
these tables. Load a small amount of data into the system.

#### Sample Data
Sample data generated using code generator is available [here]()

#### Software Stack

This project uses the following stack,
1. Node-JS
2. PostgreSQL

#### Why PostgreSQL

Reasons for choosing PostgreSQL are
    * It is the most advanced open-source relational database in the world.
    * It was created with the goal of being highly extensible.
    * It is an object-relational database, meaning that although it's primarily a relational database it also includes features — like table inheritance and function overloading — that are more often associated with object databases.
    * Postgres is capable of efficiently handling concurrency.
    * ACID compliant Transactions.

#### Lessons learned

Following are learned after doing this project
    * Node module for interating with PostgresSQL using javascript
    * Points to be considered while generating synthetic data for benchmarking a database

#### Build Instructions

Disclaimer: This project is verified only in Ubuntu 18+.

1. Prerequisites for build
    * Install latest Node version
    * Install postgres

2. Setup the project

    ```bash
    git clone https://github.com/Yokeshthirumoorthi/postgres-wisconsin-benchmark.git
    cd postgres-wisconsin-benchmark
    ```
3. Creating the Database

    ```bash
    npm install
    npm start
    ```
## Sending Feedback

We are always open to [your feedback](https://github.com/Yokeshthirumoorthi/postgres-wisconsin-benchmark/issues).

#### License

This program is licensed under the "MIT License". Please see the file LICENSE in the source distribution of this software for license terms.
