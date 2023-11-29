const { ROUTES } = require("../const");
const { Bot, Keyboard } = require("grammy");

class UserController {
  constructor(router, userService) {
    this.route = router.route(ROUTES.user);

    this.route.on("message", async (ctx) => {
      if (ctx.session.createPartySteps.creatorId === undefined) {
        ctx.session.createPartySteps.creatorId = ctx.session.localUser.id;
        return ctx.reply("Для начала, укажи дату дедлайна", {
          reply_markup: { remove_keyboard: true },
        });
      }

      try {

       

        const newParty = await partyService.createParty(
          ctx.session.localUser.id,
          ctx.session.createPartySteps.deadline,
          ctx.session.createPartySteps.isHide,
          ctx.session.createPartySteps.price,
          ctx.session.createPartySteps.pass,
        );
        console.log(newParty);

        ctx.session.step = ROUTES.user; //TODO: прописать пеймент контроллер
        ctx.reply("стоимость твоего заказа : 123242134253143245 рублей"); //TODO:прописать формулу подсчета заказа
      } catch (error) {
        return ctx.reply("Что-то пошло не так...");
      }
    });
  }
}

module.exports = { UserController };