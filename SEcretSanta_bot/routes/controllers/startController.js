//TODO: ROUTES! start => party||User
const { ROUTES } = require("../const");
const {  Keyboard } = require("grammy");

class StartController {
  constructor(router) {
    this.route = router.route(ROUTES.start);


    this.route.command("start", async (ctx) => {
      const keyboardG = new Keyboard();
      ctx.reply("Привет,в этом боте ты можешь создать или вступить в уже готовую вечеринку");
      
        keyboardG.text("Создать вечеринку");
        ctx.session.step = ROUTES.party;
          keyboardG.row();
          keyboardG.text("вступить в вечеринку по коду");
          ctx.session.step = ROUTES.user;
          keyboardG.resized();
      ctx.reply("Выберите опцию:", {
        reply_markup: keyboardG,
      });
        
      });
      
    };
  }


module.exports = { StartController };
