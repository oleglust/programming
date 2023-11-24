//TODO: ROUTES! start => party||User
const {  Keyboard } = require("grammy");

class StartController {
  constructor() {

    this.route.command("start", async (ctx) => {
      const keyboardG = new Keyboard();
      
        keyboardG.text("ppp");
        
          keyboardG.row();
          keyboardG.resized();
      ctx.reply("Выберите опцию:", {
        reply_markup: keyboardG,
      });
        
      });
      
    };
  }


module.exports = { StartController };
