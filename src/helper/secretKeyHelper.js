const crypto = require('crypto');

const key1 = crypto.randomBytes(32).toString('hex');
const key2 = crypto.randomBytes(32).toString('hex');

console.table({key1, key2});

// key1 : '1422cb21a84e9d194f693f7f574c1fb6c566af290848099f10c26c1bef94d36c'


// key2 :  '1422cb21a84e9d194f693f7f574c1fb6c566af290848099f10c26c1bef94d36c'