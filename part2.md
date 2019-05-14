#### Systems

* Postgresql
* Aerospike

#### Server Configurations
* OS: Ubuntu 18.04
* RAM: 16 GB
* Processor: AMD® A10-8700p radeon r6
* Cores: 4

#### System Research

1. Read experiments by placing filesystem in various drives.
2. Append only writes with multiple clients in both the systems.
3. Update query run on various columns, only in postgres.
4. Aggregate Query on various mem size, only in postgres.

### Read Experiment
* This test explores the performance of systems when the files are on different storage drives.
* Test Specification:
    * SCALES: [1_000, 10_000, 100_000,  1M] 
    * SCRIPT: "SELECT * FROM TENKTUP2 WHERE unique2 = 2001"
    * SETCLIENTS: [1]
    * ENVIROMENTS: [HDD, SSD]
    * SYSTEMS: [POSTGRESQL, AEROSPIKE] 
* Metrics: 
    * TPS vs Scaling factor vs DB Size

### Write Experiment (Append-only)
* This test explores how does the system work when we have large enough number of clients combined with more bytes written each time.
* Test Specification:
    * SCALES: 1M 
    * SCRIPT: "INSERT <TUPLE> INTO <RELATION>"; Client app inserts the generated row into the data table.
    * SETCLIENTS: [1, 2, 4, 8, 16, 32]
    * ENVIROMENTS: [HDD]
    * SYSTEMS: [POSTGRESQL, AEROSPIKE] 
* Metrics:
    * TPS vs number of clients

### Update Expeiment
* This experiment compares the update performance of postgres on data columns, where each column has different skewness.
* Test Specification:
    * SCALES: 1M 
    * SCRIPT: [
                "UPDATE TENKTUP1 SET onepercent = 101 WHERE onepercent= 1",
                "UPDATE TENKTUP1 SET tenpercent = 11 WHERE tenpercent= 1",
                "UPDATE TENKTUP1 SET twentypercent = 6 WHERE twentypercent= 1",
                "UPDATE TENKTUP1 SET fiftypercent = 2 WHERE fiftypercent= 1
                ] 
    * ENVIROMENTS: [HDD]
    * SYSTEMS: [POSTGRESQL] 
    * SETCLIENTS: [1]
* Metrics:
    * Evalutaion time

### MemSize Expeiment
* This experiment compares the read performance of postgres for varying memsize.
* Test Specification:
    * SCALES: 100_000 
    * SCRIPT: "SELECT * FROM TENKTUP2 WHERE unique2 = 2001"
    * WORKMEM: [4MB, 8MB]
    * ENVIROMENTS: [HDD]
    * SYSTEMS: [POSTGRESQL] 
    * SETCLIENTS: [1]
* Metrics:
    * Evalutaion time

