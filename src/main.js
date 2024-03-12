const elastic = require("./elastic");
const data = require("./data");
const server = require("./server");
require("dotenv").config();

(async function main() {
  const isElasticReady = await elastic.checkConnection();
  if (isElasticReady) {
    server.start();
  }
})();
