const { Bot, session, GrammyError, HttpError } = require("grammy");
const {PartyService}=require("../service/partyService")
const {UserService}=require("../service/userService")
const { dbManager } = require("../db");
const { RouteController, ROUTES } = require("../routes");


class BotApp {
    constructor(token) {
      this.bot = new Bot(token);
      this.userService = new UserService();
      this.partyService = new PartyService();
      this.routeController = new RouteController();

    }
  
    async initDb() {
      try {
        await dbManager.authenticate();
        console.log("Connection has been established successfully.");
  
        // Object.entries(dbManager.models).forEach((model) => {
  
        //   const [key, value] = model; // = конструкция ниже
        //   // const key = model[0];
        //   // const value = model[1];
  
        //   if (value.associate) {
        //     value.associate(dbManager.models); //запуск ассоциаций
        //   }
        // });
  
        Object.values(dbManager.models).forEach((value) => {
          if (value.associate) {
            value.associate(dbManager.models); //запуск ассоциаций
          }
        });
  
        dbManager.sync({
          force: true,
        });
      } catch (error) {
        console.error("Unable to connect to the database:", error);
      }
    }
  
    async start() {
      await this.initDb();
  
      this.bot.use(
        session({
          initial: () => ({
            localUser: null, // сюда будем записывать пользователя, записанного в БД. все данные.
            step: ROUTES.start,
            createPartySteps: {
              creatorId: undefined,
              deadline: undefined,
              isHide: undefined,
              price: undefined,
              pass: undefined,
            },
            localuserWish: undefined
          }),
        })
      ); // подключение session(нужна для сохранения состояния данных/запросов при общении с юзером) в {} прописываются параметры сессии.
  
      this.bot.use(this.userService.createUserMiddleware);
      this.bot.use(this.routeController.router);

  
      this.bot.start();
  
      this.bot.catch((err) => {
        const ctx = err.ctx;
        console.error(`Error while handling update ${ctx.update.update_id}:`);
        const e = err.error;
        if (e instanceof GrammyError) {
          console.error("Error in request:", e.description);
        } else if (e instanceof HttpError) {
          console.error("Could not contact Telegram:", e);
        } else {
          console.error("Unknown error:", e);
        }
      });
    }
  }
  
  module.exports = { BotApp };
  