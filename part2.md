#### Choice of systems

* Postgresql
* Aerospike

#### Why Postgresql vs Aerospike

In the [architecture overview of Aerospike](https://www.aerospike.com/docs/architecture/index.html), it is mentioned that Aerospike provides the robustness and reliability (as in ACID) expected from traditional databases. 

Moreover, from [Aerospike Benchmarks page](https://www.aerospike.com/resources/benchmarks/), it is clear that Aerospike has proven to outperform Cassandra and Redis. But there is no benchmark to understand how Aerospike compares with Postgresql. Even in [YCSB](https://github.com/brianfrankcooper/YCSB), postgresql has been added as a candidate database only a few weeks ago.

Hence a comparision between these two systems looks to be an interesting choice.

#### System Research    

1. Aerospike Storage:
Ref: https://www.aerospike.com/docs/architecture/storage.html

Aerospike can store data in DRAM, SSDs, and traditional spinning media. Each namespace is separately configurable, which allows developers to put small, frequently accessed namespaces in DRAM, and put larger namespaces in less expensive storage such as SSD. Aerospike optimizes data storage on SSDs by bypassing the file system, which takes advantage of low-level SSD read and write patterns. 

2. Postgres Disk Setup:
Ref: Postgres 10 High Availability (by Gregory Smith; Enrico Pirozzi; Ibrar Ahmed)
Most operating systems (OSes) include multiple options for the filesystem used to store information onto the disk. Choosing between these options can be difficult, because it normally involves some tricky speed versus reliability trade-offs. Similarly, how to set up your database to spread its components across many available disks also has trade-offs, with speed, reliability, and available disk space all linked.

3. Aerospike Primary Index:
Ref: https://www.aerospike.com/docs/architecture/primary-index.html
In an operational database, the fastest and most predictable index is the primary key index. In Aerospike, the primary key index is a blend of distributed hash table technology with a distributed tree structure in each server. 

4. Postgresql work_mem option:
Ref: https://www.postgresql.org/docs/9.4/runtime-config-resource.html 
When a query is running that needs to sort data, the database estimates how much data is involved and then compares it to the work_mem parameter. If it's larger (and the default is only 1 MB), rather than sorting in memory it will write all the data out and use a disk-based sort instead. This is much, much slower than a memory based one.

5. Enable_hashjoin (boolean)
Ref: https://www.postgresql.org/docs/9.4/runtime-config-query.html
Enables or disables the query planner's use of hash-join plan types. The default is on.


#### Server Configuration Used For These Experiments 
* OS: Ubuntu 18.04
* RAM: 16 GB
* Processor: AMD® A10-8700p radeon r6
* Cores: 4

#### System Research

### Overview
1. Read experiments by placing filesystem in various drives.
2. Append only writes with multiple clients in both the systems.
3. Update query run on various columns, only in postgres.
4. Sort Query on various mem size, only in postgres.

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
* Expected Output:
    * Aerospike would outperform Postgresql on both HDD and SSD, atleast by a factor of 2.

### Write Experiment (Append-only)
* This test explores how does the system work when we have large enough number of clients combined with more bytes written each time.
* Test Specification:
    * DATASIZE: 1M 
    * SCRIPT: "INSERT <TUPLE> INTO <RELATION>"; Client app inserts the dynamically generated rows into the data table.
    * SETCLIENTS: [1, 2, 4, 8, 16, 32]
    * ENVIROMENTS: [HDD]
    * SYSTEMS: [POSTGRESQL, AEROSPIKE] 
* Metrics:
    * TPS vs number of clients
* Expected Output:
    * Aerospike would outperform Postgresql, for all values of concurrent clients , atleast by a factor of 2.

### Update Expeiment
* This experiment compares the update performance of postgres on data columns, where each column has different skewness.
* Test Specification:
    * DATASIZE: 1M 
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
* Expected Output:
    * Since onepercent, tenpercent, twentypercent and fiftypercent are nonindexed columns, all the queries should take same time for execution in spite of its skewness. 

### MemSize Expeiment
* This experiment compares the read performance of postgres for varying memsize.
* Test Specification:
    * DATASIZE: 100_000 
    * SCRIPT: "SELECT * FROM TENKTUP1 ORDER BY stringu1 ASC"
    * WORKMEM: [8MB, 4MB]
    * ENVIROMENTS: [HDD]
    * SYSTEMS: [POSTGRESQL] 
    * SETCLIENTS: [1]
* Metrics:
    * Evalutaion time
* Expected Output:
    * Decrease in work_mem size by half the value should twice the execution time of sort query. 

#### Lessons Learned and Issues Faced
* Learned the [Aerospike Proceedings of VLDB (Very Large Databases)](https://www.aerospike.com/docs/architecture/assets/vldb2016.pdf) 
* Explored various Aerospike benchmark libraries including YCSB and various Aerospike clients.
* Installed and dabbled with basic Aerospike configurations.