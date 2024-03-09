const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");

const esclient = new Client({
  node: "https://127.0.0.1:9200",
  auth: {
    username: "elastic",
    password: "2=4Z9kv_qWrZoVszV0HI",
  },
  tls: {
    ca: fs.readFileSync(
      "D://Downloads/haui/DA/source/elasticsearch-service/http_ca.crt",
      "utf8"
    ),
  },
});
const index = "tuan";
const type = "quotes";

async function createIndex(index) {
  try {
    await esclient.indices.create({ index });
    console.log(`Created index ${index}`);
  } catch (err) {
    console.error(`An error occurred while creating the index ${index}:`);
    console.error(err);
  }
}

async function setQuotesMapping() {
  try {
    const schema = {
      quote: {
        type: "text",
      },
      author: {
        type: "text",
      },
    };

    await esclient.indices.putMapping({
      index,
      type,
      include_type_name: true,
      body: {
        properties: schema,
      },
    });

    console.log("Quotes mapping created successfully");
  } catch (err) {
    console.error("An error occurred while setting the quotes mapping:");
    console.error(err);
  }
}

function checkConnection() {
  return new Promise(async (resolve) => {
    console.log("Checking connection to ElasticSearch...");
    let isConnected = false;
    while (!isConnected) {
      try {
        await esclient.cluster.health({});
        console.log("Successfully connected to ElasticSearch");
        isConnected = true;
        // eslint-disable-next-line no-empty
      } catch (_) {}
    }
    resolve(true);
  });
}

module.exports = {
  esclient,
  setQuotesMapping,
  checkConnection,
  createIndex,
  index,
  type,
};
