const Aerospike = require('aerospike');
const WiscData = require('../wiscData');
const array = require('lodash/array');

// colection of all tuples
const dataset = WiscData.dataset_as_json;

const config = {
  hosts: 'localhost:3000',
  log: { level: Aerospike.log.INFO },
  maxConnsPerNode: 1000
}
const key = new Aerospike.Key('test', 'demo', 'demo')

const loadDataInRelation_Parallel = (datachunk) => {
  Aerospike.connect(config)
    .then(client => {
      const bins = datachunk;
      const meta = { ttl: 10000 }
      const policy = new Aerospike.WritePolicy({
        exists: Aerospike.policy.exists.CREATE_OR_REPLACE
      })

      // return client.put(key, bins, meta, policy)
      return Promise.all(datachunk.map(data => client.put(key, data, meta, policy)))
        .then(() => client.close())
    })
    .catch(error => {
      console.error('Error: %s [%i]', error.message, error.code)
      if (error.client) {
        error.client.close()
      }
    })
};

const do_parallel = (client_count) => {
  const DATA_COUNT = 1000;
  const CHUNK_SIZE = DATA_COUNT / client_count;
  const start = new Date();
  return Promise.all(array.chunk(dataset, CHUNK_SIZE).map(loadDataInRelation_Parallel))
      .then(_ => {
              const end = new Date() - start;
              const total_time_sec = end / DATA_COUNT;
              const tps = DATA_COUNT / total_time_sec;
              console.log(client_count + ' clients --- TPS: %d', tps);
      })    
}

const SET_CLIENTS = [1, 2, 4, 8, 16, 32];

SET_CLIENTS.map(do_parallel);
