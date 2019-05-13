const Aerospike = require('aerospike');
const WiscData = require('../wiscData');

const generateTuple = (primaryKey, index) => { return { 
    unique1:WiscData.dataset.unique1[index], 
    unique2:primaryKey,
    two:WiscData.dataset.two[index],
    four:WiscData.dataset.four[index],
    ten:WiscData.dataset.ten[index],
    twenty:WiscData.dataset.twenty[index],
    onePercent:WiscData.dataset.onePercent[index],
    tenPercent:WiscData.dataset.tenPercent[index],
    twentyPercent:WiscData.dataset.twentyPercent[index],
    fiftyPercent:WiscData.dataset.fiftyPercent[index],
    unique3:WiscData.dataset.unique3[index],
    evenOnePercent:WiscData.dataset.evenOnePercent[index],
    oddOnePercent:WiscData.dataset.oddOnePercent[index],
    stringu1:WiscData.dataset.stringu1[index], 
    stringu2:WiscData.dataset.stringu2[index], 
    string4:WiscData.dataset.string4[index]
  }};
  
const dataset = WiscData.dataset.unique2.map(generateTuple);

const config = {
  hosts: 'localhost:3000'
}
const key = new Aerospike.Key('test', 'demo', 'demo')

Aerospike.connect(config)
  .then(client => {
    const bins = dataset;
    const meta = { ttl: 10000 }
    const policy = new Aerospike.WritePolicy({
      exists: Aerospike.policy.exists.CREATE_OR_REPLACE
    })

    return client.put(key, bins, meta, policy)
      .then(result => {
        console.log(result.bins) // => { i: 124, l: 4, m: null }

        return client.get(key)
      })
      .then(record => {
        console.log(record.bins) // => { i: 124,
                                 //      s: 'hello',
                                 //      b: <Buffer 77 6f 72 6c 64>,
                                 //      d: 3.1415,
                                 //      g: '{"type":"Point","coordinates":[103.913,1.308]}',
                                 //      l: [ 1, 'a', { x: 'y' }, 'z' ],
                                 //      m: { foo: 4 } }
      })
      .then(() => client.close())
  })
  .catch(error => {
    console.error('Error: %s [%i]', error.message, error.code)
    if (error.client) {
      error.client.close()
    }
  })