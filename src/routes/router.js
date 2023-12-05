const {PartyService} =require("../service/partyService");
const {UserService, FillWish} =require("../service/userService");
const { Bot, Keyboard, InlineKeyboard } = require("grammy");




class App {
  constructor() {
    this.partyService = new PartyService();
    this.userService = new UserService();
           
    this.fillWish = new FillWish();
    this.partyService = new PartyService();
  }
    

  }


module.exports = { App };