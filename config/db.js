const config = require("config");

if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: config.mongoURI
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/vidjot-dev" };
}
