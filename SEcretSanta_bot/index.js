const { BotApp } = require("./app/botApp");
require("dotenv").config();

async function main() {
  const botApp = new BotApp(process.env.TOKEN);
  await botApp.start();
}

main();