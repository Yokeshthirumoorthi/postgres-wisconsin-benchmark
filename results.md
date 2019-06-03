#### Experiment 4

* References:
    * https://www.depesz.com/2011/07/03/understanding-postgresql-conf-work_mem/
    * https://blog.codeship.com/tuning-postgresql-with-pgbench/
    * https://pgbadger.darold.net/documentation.html
    * http://okigiveup.net/what-postgresql-tells-you-about-its-performance/

```
EXPLAIN ANALYSE SELECT * FROM TENKTUP1 ORDER BY stringu1 ASC;
SHOW WORK_MEM;
SHOW SERVER_VERSION;
SHOW ALL;
SET work_mem = '2MB';
SELECT xact_commit+xact_rollback FROM pg_stat_database WHERE datname = 'wisc';
select pg_stat_reset();
```


"Gather Merge  (cost=15314.58..22080.83 rows=58837 width=211) (actual time=537.166..920.525 rows=100000 loops=1)"
"  Workers Planned: 1"
"  Workers Launched: 1"
"  ->  Sort  (cost=14314.57..14461.66 rows=58837 width=211) (actual time=527.389..611.121 rows=50000 loops=2)"
"        Sort Key: stringu1"
"        Sort Method: external merge  Disk: 10840kB"
"        ->  Parallel Seq Scan on tenktup100k  (cost=0.00..3619.37 rows=58837 width=211) (actual time=0.015..78.126 rows=50000 loops=2)"
"Planning time: 0.112 ms"
"Execution time: 1044.701 ms"

"Gather Merge  (cost=15314.58..22080.83 rows=58837 width=211) (actual time=458.023..897.734 rows=100000 loops=1)"
"  Workers Planned: 1"
"  Workers Launched: 1"
"  ->  Sort  (cost=14314.57..14461.66 rows=58837 width=211) (actual time=451.710..561.965 rows=50000 loops=2)"
"        Sort Key: stringu1"
"        Sort Method: external merge  Disk: 10680kB"
"        ->  Parallel Seq Scan on tenktup100k  (cost=0.00..3619.37 rows=58837 width=211) (actual time=0.015..79.938 rows=50000 loops=2)"
"Planning time: 0.123 ms"
"Execution time: 1021.759 ms"

"Gather Merge  (cost=15314.58..22080.83 rows=58837 width=211) (actual time=361.934..773.624 rows=100000 loops=1)"
"  Workers Planned: 1"
"  Workers Launched: 1"
"  ->  Sort  (cost=14314.57..14461.66 rows=58837 width=211) (actual time=354.373..484.059 rows=50000 loops=2)"
"        Sort Key: stringu1"
"        Sort Method: external merge  Disk: 11144kB"
"        ->  Parallel Seq Scan on tenktup100k  (cost=0.00..3619.37 rows=58837 width=211) (actual time=0.017..72.284 rows=50000 loops=2)"
"Planning time: 0.163 ms"
"Execution time: 896.903 ms"

"Sort  (cost=12338.13..12588.18 rows=100023 width=211) (actual time=755.631..889.171 rows=100000 loops=1)"
"  Sort Key: stringu1"
"  Sort Method: quicksort  Memory: 29635kB"
"  ->  Seq Scan on tenktup100k  (cost=0.00..4031.23 rows=100023 width=211) (actual time=0.015..120.679 rows=100000 loops=1)"
"Planning time: 0.103 ms"
"Execution time: 994.505 ms"

"Sort  (cost=12338.13..12588.18 rows=100023 width=211) (actual time=749.805..879.322 rows=100000 loops=1)"
"  Sort Key: stringu1"
"  Sort Method: quicksort  Memory: 29635kB"
"  ->  Seq Scan on tenktup100k  (cost=0.00..4031.23 rows=100023 width=211) (actual time=0.015..127.525 rows=100000 loops=1)"
"Planning time: 0.101 ms"
"Execution time: 985.191 ms"

Q1:
"Update on tenktup1m  (cost=0.00..43254.59 rows=9903 width=217) (actual time=757.809..757.810 rows=0 loops=1)"
"  ->  Seq Scan on tenktup1m  (cost=0.00..43254.59 rows=9903 width=217) (actual time=0.089..572.538 rows=10000 loops=1)"
"        Filter: (onepercent = 1)"
"        Rows Removed by Filter: 990000"
"Planning time: 0.111 ms"
"Execution time: 757.871 ms"

Q2:
"Update on tenktup1m  (cost=0.00..43682.56 rows=103481 width=217) (actual time=8781.484..8781.484 rows=0 loops=1)"
"  ->  Seq Scan on tenktup1m  (cost=0.00..43682.56 rows=103481 width=217) (actual time=0.090..948.238 rows=100000 loops=1)"
"        Filter: (tenpercent = 1)"
"        Rows Removed by Filter: 900000"
"Planning time: 0.121 ms"
"Execution time: 8781.547 ms"

Q3:
"Update on tenktup1m  (cost=0.00..47568.31 rows=221483 width=217) (actual time=15800.129..15800.130 rows=0 loops=1)"
"  ->  Seq Scan on tenktup1m  (cost=0.00..47568.31 rows=221483 width=217) (actual time=0.054..2159.715 rows=200000 loops=1)"
"        Filter: (twentypercent = 1)"
"        Rows Removed by Filter: 800000"
"Planning time: 0.113 ms"
"Execution time: 15800.192 ms"

Q4:
"Update on tenktup1m  (cost=0.00..53171.65 rows=625330 width=217) (actual time=43801.947..43801.948 rows=0 loops=1)"
"  ->  Seq Scan on tenktup1m  (cost=0.00..53171.65 rows=625330 width=217) (actual time=0.052..10364.278 rows=500000 loops=1)"
"        Filter: (fiftypercent = 1)"
"        Rows Removed by Filter: 500000"
"Planning time: 0.119 ms"
"Execution time: 43802.001 ms"

1K:

1 clients --- TPS: 58823.5294117647  
2 clients --- TPS: 52631.57894736842        
4 clients --- TPS: 55555.55555555556                
8 clients --- TPS: 55555.55555555556                    
16 clients --- TPS: 62500                                       
32 clients --- TPS: 76923.07692307692   

100K:
1 clients --- TPS: 34482.75862068965
2 clients --- TPS: 40000
4 clients --- TPS: 40000
8 clients --- TPS: 43478.260869565216
16 clients --- TPS: 47619.04761904762
32 clients --- TPS: 55555.55555555556

1M:
1 clients --- TPS: 35714.28571428571
2 clients --- TPS: 40000
4 clients --- TPS: 43478.260869565216
8 clients --- TPS: 45454.545454545456
16 clients --- TPS: 47619.04761904762
32 clients --- TPS: 55555.55555555556


Aero:1K:
1 clients --- TPS: 3968.253968253968
2 clients --- TPS: 3952.5691699604745
4 clients --- TPS: 4065.040650406504
8 clients --- TPS: 4291.845493562231
16 clients --- TPS: 4761.904761904762
32 clients --- TPS: 7407.407407407407
Total Records in bin: 1000

Aero:10K:
1 clients --- TPS: 522.7391531625718                                                                
2 clients --- TPS: 535.6186395286556                                            
4 clients --- TPS: 563.3802816901409                                            
8 clients --- TPS: 619.9628022318661                                            
16 clients --- TPS: 741.2898443291327                                            
32 clients --- TPS: 1173.7089201877934 