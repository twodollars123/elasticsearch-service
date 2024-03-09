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
  if (!body.quote || !body.author) {
    res.status(422).json({
      error: true,
      data: "Missing required parameter(s): 'body' or 'author'",
    });
    return;
  }
  try {
    const result = await model.insertNewQuote(body.quote, body.author);
    res.json({
      success: true,
      data: {
        id: result.body._id,
        author: body.author,
        quote: body.quote,
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
module.exports = {
  getQuotes,
  addQuote,
  getProductByName,
};
