const Site = require("../models/sites");

exports.getAllSites = async (req, res) => {
  Site.findAll()
    .then((result) => {
      res.json({
        error: false,
        message: result,
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        message: "Couldn't get sites! " + e,
      });
    });
};
