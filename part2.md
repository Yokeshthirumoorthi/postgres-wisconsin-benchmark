#### Systems

* Postgresql
* Aerospike

#### Server Configurations

#### System Research

1. Read experiments by placing filesystem in various drives.
2. Append only writes with multiple clients in both the systems.
3. Update query run on various columns, only in postgres.
4. Aggregate Query on various mem size, only in postgres.

### Read Experiment
* This test explores the performance of systems when the files are on different storage drives.
    * Criterias:
        * SCALES: [10, 1_000, 10_000, 100_000,  1M] 
        * SCRIPT: ""
        * TOTTRANS: 1M
        * ENVIROMENTS: [HDD, SSD]
* Metrics: 
    * TPS vs Scaling factor vs DB Size

### Write Experiment (Append-only)
* This test explores how does the system work when we have large enough number of clients combined with more bytes written each time.
* Test Specification:
    * SCALES_UPTO: 1M 
    * SCRIPT: Simple Wisconsim insert operation
    * SETCLIENTS: [1, 10, 1_00, 1_000]
* Metrics:
    * TPS vs number of clients

### Update Expeiment
* This experiment compares the update performance of postgres on data columns, where each column has different skewness.
* Test Specification:
    * SCALES_UPTO: 1M 
    * SCRIPT: Simple Wisonsin tuple insert operation
    * SETCLIENTS: [1]
* Metrics:
    * Evalutaion time

### MemSize Expeiment
* This experiment compares the read performance of postgres for varying memsize.
* Test Specification:
    * SCALES_UPTO: 100_000 
    * SCRIPT: ""
    * SETCLIENTS: [1]
* Metrics:
    * Evalutaion time

