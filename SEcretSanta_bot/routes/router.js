const { Router } = require("@grammyjs/router");
const { StartController } = require("./controllers/startController");
const { ROUTES } = require("./const");
const {PartyService} =require("../service/partyService");
const {UserService, FillWish} =require("../service/userService");
const { PartyController } = require("./controllers/partyController");
const { UserController } = require("./controllers/userController");
const { Bot, Keyboard } = require("grammy");




class RouteController {
  constructor() {
    this.router = new Router((ctx) => ctx.session.step);
    this.partyService = new PartyService();
    this.userService = new UserService();
    this.fillWish = new FillWish();

    // this.routes = [
    //   new StartController(this.router),
    //   new PartyController(
    //     this.router,
    //     this.partyService
    //   ),
    //   new UserController(
    //     this.router,
    //     this.userService
    //     ),
    // ];
    // this.router.otherwise((ctx) => {
    //   console.log(ctx);
    //   ctx.reply("Нет совпадений");
    // });
    this.route = this.router.route(ROUTES.start);
    this.route.command("start", async (ctx) => {
      const keyboardG = new Keyboard();
      ctx.reply("Привет,в этом боте ты можешь создать или вступить в уже готовую вечеринку");
      
        keyboardG.text("Погнали!", "party");
          keyboardG.resized();
      ctx.reply("погнали?", {
        reply_markup: keyboardG,
      });
    });

    this.route.on("message", async (ctx) => {
      const keyboardG = new Keyboard();
      const text = ctx.message.text;
      keyboardG.text("Создать вечеринку");
      keyboardG.row();
      keyboardG.text("вступить в вечеринку по коду");
      keyboardG.resized();
  ctx.reply("Выберите опцию:", {
    reply_markup: keyboardG,
    
  });
      if(text === "Создать вечеринку") {
        ctx.session.step = ROUTES.party;
        return
      }

      
     if(text === "вступить в вечеринку по коду") {
        ctx.session.step = ROUTES.user;
      }


    });
  //_____________________________________________________________________
  //_____________________________________________________________________
  //_____________________________________________________________________
  //_____________________________________________________________________
  //_____________________________________________________________________
  //_____________________________________________________________________
  
    this.route = this.router.route(ROUTES.party);

    this.route.on("message", async (ctx) => {
      if (ctx.session.createPartySteps.creatorId === undefined) {
        ctx.session.createPartySteps.creatorId = ctx.session.localUser.tgUserId;
        return ctx.reply("Для начала, укажи дату дедлайна", {
          reply_markup: { remove_keyboard: true },
        } )
      }

      if (ctx.session.createPartySteps.deadline === undefined){ 
        ctx.session.createPartySteps.deadline = ctx.update.message.text;
        return ctx.reply("Имена людей будут скрыты?(Вы увидете только желание человека)");
        }
      if (ctx.session.createPartySteps.isHide === undefined){ 
          ctx.session.createPartySteps.isHide = ctx.update.message.text;
          return ctx.reply("стоимость подарка");
          }
      if (ctx.session.createPartySteps.price === undefined){ 
            ctx.session.createPartySteps.price = ctx.update.message.text;
            return ctx.reply("придумай пароль");
            }
      if (ctx.session.createPartySteps.pass === undefined){ 
              ctx.session.createPartySteps.pass = ctx.update.message.text;
              return ctx.reply("ehf");
              }

      try {
        const newParty = await partyService.createParty(
          ctx.session.localUser.tgUserId,
          ctx.session.createPartySteps.deadline,
          ctx.session.createPartySteps.isHide,
          ctx.session.createPartySteps.price,
          ctx.session.createPartySteps.pass,
        );
        console.log(newParty);

        ctx.session.step = ROUTES.user; 
        ctx.reply("вечеринка создана"); 
      } catch (error) {
        return ctx.reply("Что-то пошло не так...");
      }
    });

  }
}

module.exports = { RouteController };