const model = require("../models");
const { esclient, index, type } = require("../../elastic");

async function getQuotes(req, res) {
  const query = req.query;
  if (!query.text) {
    res.status(422).json({
      error: true,
      data: "Missing required parameter: text",
    });
    return;
  }
  try {
    const result = await model.getQuotes(req.query);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error." });
  }
}

async function addQuote(req, res) {
  const body = req.body;
  if (!body.name || !body.author) {
    res.status(422).json({
      error: true,
      data: "Missing required parameter(s): 'body' or 'author'",
    });
    return;
  }
  try {
    const result = await model.insertNewQuote(
      body.index,
      body.name,
      body.author
    );
    res.json({
      success: true,
      data: {
        result,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error." });
  }
}

async function getProductByName(req, res, next) {
  console.log("rep.body:::", req.body);
  console.log("rep.params:::", req.query);
  const { index, name } = req.query;

  try {
    const result = await esclient.search({
      index,
      body: {
        query: {
          match: {
            name,
          },
        },
      },
    });
    if (result) {
      console.log("result:::", result);
      res.status(200).json(result);
    }
  } catch (error) {
    console.log("error:::", error);
  }
}

async function searchDocs(req, res, next) {
  const { body } = req; // Assuming request body is in req.body

  const query = {
    query: {
      function_score: {
        functions: [
          {
            gauss: {
              price: {
                origin: "0",
                scale: body.price,
              },
            },
          },
          {
            gauss: {
              location: {
                origin: body.location, // Replace with actual latitude and longitude
                scale: "4km",
              },
            },
          },
        ],
        query: {
          match: {
            id_hotel: "1",
          },
        },
        score_mode: "multiply",
      },
    },
    size: 5,
  };
  try {
    const result = await esclient.search({
      index: "hotel", // Replace with your actual hotel index name
      body: query,
    });
    if (!result) {
      return res.status(401).json("khong co du lieu");
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log("errr::", error);
  }
}
module.exports = {
  getQuotes,
  addQuote,
  getProductByName,
  searchDocs,
};
