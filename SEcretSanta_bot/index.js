const { BotApp } = require("./app/botApp");
require("dotenv").config();
const { User } = require("./entity/user");
const { Balance } = require("./entity/balance");
const { Order } = require("./entity/order");
const { SmmService } = require("./entity/smmService");

async function main() {
  const botApp = new BotApp(process.env.TOKEN);
  await botApp.start();
}

main();