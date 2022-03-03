const express = require("express");
const config = require("config");
const winston = require("winston");
const customer = require("./route/customer");
const auth = require("./route/auth");
const users = require("./route/users");

require("./middleware/database").connect();

const app = express();
app.use(express.json());

app.use("/api/customers", customer);
app.use("/api/auth", auth);
app.use("/api/users", users);

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

module.exports = server;
