const { Router } = require("@grammyjs/router");
const { StartController } = require("./controllers/startController");
const { ROUTES } = require("./const");
const {PartyService} =require("../service/partyService");
const {UserService, FillWish} =require("../service/userService");
const { PartyController } = require("./controllers/partyController");
const { UserController } = require("./controllers/userController");




class RouteController {
  constructor() {
    this.router = new Router((ctx) => ctx.session.step);
    this.partyService = new PartyService();
    this.userService = new UserService();
    this.fillWish = new FillWish();

    this.routes = [
      new StartController(this.router),
      new PartyController(
        this.router,
        this.partyService
      ),
      new UserController(
        this.router,
        this.userService
        ),
    ];
    this.router.otherwise((ctx) => {
      console.log(ctx);
      ctx.reply("Нет совпадений");
    });
  }
}

module.exports = { RouteController };