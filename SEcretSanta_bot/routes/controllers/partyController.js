const { ROUTES } = require("../const");
const { Bot, Keyboard } = require("grammy");

class PartyController {
  constructor(router, partyService) {
    this.route = router.route(ROUTES.party);
    //const keyboardG = new Keyboard();

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

module.exports = { PartyController };