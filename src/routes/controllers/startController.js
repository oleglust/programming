//TODO: ROUTES! start => party||User
const { ROUTES } = require("../const");
const {  Keyboard } = require("grammy");

class StartController {
  constructor(router) {
    this.route = router.route(ROUTES.start);


  //   this.route.command("start", async (ctx) => {
  //     const keyboardG = new Keyboard();
  //     ctx.reply("Привет,в этом боте ты можешь создать или вступить в уже готовую вечеринку");
      
  //       keyboardG.text("Погнали!", "party");
  //         //РАЗОБРАТЬСЯ!
  //         // ctx.session.step = ROUTES.user;
  //         keyboardG.resized();
  //     ctx.reply("погнали?", {
  //       reply_markup: keyboardG,
        
  //     });
        
  //   });

  //   this.route.on("message", async (ctx) => {
  //     const keyboardG = new Keyboard();

  //     const text = ctx.message.text;
  //     keyboardG.text("Создать вечеринку");
  //     keyboardG.row();
  //     keyboardG.text("вступить в вечеринку по коду");
  //     keyboardG.resized();
  // ctx.reply("Выберите опцию:", {
  //   reply_markup: keyboardG,
    
  // });
  //     if(text === "Создать вечеринку") {
  //       ctx.session.step = ROUTES.party;
  //       return
  //     }

      
  //     if(text === "вступить в вечеринку по коду") {
  //       ctx.session.step = ROUTES.user;
  //     }
    
  //   });
   };
      
    };
  


module.exports = { StartController };
