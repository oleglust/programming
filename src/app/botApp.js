const { Bot, session, GrammyError, HttpError, InlineKeyboard, Keyboard } = require("grammy");
const {PartyService}=require("../service/partyService")
const {UserService}=require("../service/userService")
const { dbManager } = require("../db");
const crypto = require('crypto');
const currentDate = new Date();
const shuffle = require('shuffle-array')
const _ = require("lodash");

const variants = {
  new: {text: "Создать новую вечеринку", value: "party_new"},
  enter: {text: "войти по коду", value:"party_enter"},
}
function generateStartKeyboardFunc(){
  const startKeyboard = new InlineKeyboard()
  Object.values(variants).map(item => {
    startKeyboard.text(item.text,item.value)
  })
  return startKeyboard;
}

function generatekeyboard_isHide() {
  const startKeyboard = new InlineKeyboard()
    startKeyboard
    .text("скрыть","true")
    .text("не скрывать", "false")
  return startKeyboard;
}

function generatekeyboard_shuffle() {
  const startKeyboard = new InlineKeyboard()
    startKeyboard
    .text("перемешать","shuffle_users")
    .text("Разостать сообщения","send_messages")
  return startKeyboard;
}

function generatekeyboard_deadline() {
  const startKeyboard = new InlineKeyboard()
    startKeyboard
    .text("неделя","period_week")
    .text("две недели", "period_2week")
  return startKeyboard;
}

function generateHashKey(data) {
  const hours = currentDate.getHours(); 
const minutes = currentDate.getMinutes(); 
const seconds = currentDate.getSeconds(); 
  const hash = crypto.createHash('sha256');
  hash.update(`${data}${hours}${minutes}${seconds}`);
  return hash.digest('hex');
}

class BotApp {
  constructor(token) {
    this.bot = new Bot(token);
    this.partyService = new PartyService()
    this.userService = new UserService()
  }
  async initDb() {
    try {
      await dbManager.authenticate();
      console.log("Connection has been established successfully.");


      Object.values(dbManager.models).forEach((value) => {
        if (value.associate) {
          value.associate(dbManager.models); 
        }
      });

      dbManager.sync({
        force: false,
      });
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
  async start() {
    this.bot.use(
      session({
        initial: () => ({
          localUser: null, 
          variant: null,
          chosenParty: null,
          messageId: null,
          wish: null,
          isAdmin: null,
          createPartySteps: {
            creatorId: null,
            deadline: null,
            isHide: null,
            price: null,
            pass: null,
          },
          localuserWish: null,
        }),
      })
    ); 
    await this.startCommand();
    await this.listeners();
    await this.initDb();

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

    await this.bot.start();
  };

  async startCommand () {
    this.bot.command('start', async (ctx) => {
      ctx.session.localUser = ctx.message.from
      await ctx.reply("ssssss", {
        reply_markup: generateStartKeyboardFunc(),
      } )
    })
  }
  
  async listeners() {
    this.bot.on('callback_query:data', async (ctx) => {
      const variant = ctx.callbackQuery.data;

      if (variant === 'party_enter') {
        await ctx.reply("введите код:");
      }
 

      if(variant === 'shuffle_users'){

       
        
        await  this.userService.fillTargetId()
        // таргетайди принимает одно и то же значение для всех

        await ctx.reply("готово");

        await ctx.answerCallbackQuery();
        return;
      }
//_!_!_!_!_!__!_!_!_!_!__
      if(variant === 'send_messages'){

        this.sendMessages();
      }
      

      if(variant === 'party_new'){
        ctx.session.createPartySteps.creatorId = ctx.session.localUser.id;
        await ctx.reply("Сколько времени отведено на заполнение вечеринки?", {
          reply_markup:generatekeyboard_deadline(),
        });
        console.log(ctx.session.createPartySteps)
        await ctx.answerCallbackQuery();
        return;
      }

      if(variant === 'period_week' || variant === 'period_2week'){
        ctx.session.createPartySteps.deadline = variant
        await ctx.reply("Скрыть имена пользователей?(будет видно только желание)", {
          reply_markup: generatekeyboard_isHide(),
        })
        console.log(ctx.session.createPartySteps)
        await ctx.answerCallbackQuery();
        return;
      }

      if(variant === 'true' || variant === 'false'){
        ctx.session.createPartySteps.isHide = variant
        await ctx.reply("Средняя стоимость подарка:")
        console.log(ctx.session.createPartySteps)
        ctx.session.createPartySteps.price = "wait"
        await ctx.answerCallbackQuery();
        return;
      }

      await ctx.answerCallbackQuery();

    })

    this.bot.on('message:text', async (ctx) => {
      if(ctx.session.createPartySteps.price === "wait"){
        ctx.session.createPartySteps.price = ctx.message.text;
        console.log(ctx.message.text)
        console.log(ctx.session.createPartySteps)
        const data = 1;
        const hashKey = generateHashKey(data)
        ctx.session.createPartySteps.pass = hashKey
        console.log(hashKey);
        console.log(ctx.session.createPartySteps)
        await ctx.reply(`Праздник вот-вот наступит, вот ключ:${hashKey}`)
        this.partyService.createParty(ctx.session.createPartySteps.creatorId, ctx.session.createPartySteps.deadline, ctx.session.createPartySteps.isHide, ctx.session.createPartySteps.price, ctx.session.createPartySteps.pass)
           
       }

      if(await this.partyService.findParty(ctx.message.text) !== undefined){
        
        const party = await this.partyService.findParty(ctx.message.text);
        ctx.session.chosenParty = party
        if (ctx.session.chosenParty.creatorId == ctx.session.localUser.id) {
          ctx.reply("перемешать пользователей",
            {
            reply_markup: generatekeyboard_shuffle()
          })
        } else {
          ctx.session.wish = "wait"
        ctx.session.messageId = ctx.message.message_id

        await ctx.reply("введите свое желание максимально точно и развернуто. Пишите так, будто обращаетесь к настоящему Деду Морозу")
        }

        
        return
      }


      if(  ctx.session.wish != null ){
        ctx.session.chosenParty.wish = ctx.message.text
        await this.userService.createUser(ctx)
        
         
      }
      

      // if(ctx.session.chosenParty.wish === "wait"){
      //   ctx.session.chosenParty.wish = ctx.message.text
      // }


    })

  }

  async sendMessages(){
    const participantsIds = await this.userService.getUserIds();
        console.log(participantsIds)

        
        participantsIds.forEach(async (item)=> await this.bot.api.sendMessage(await this.userService.getTgId(item), `Привет, ты исполняешь желание замечательного человека, под именем ${await this.userService.getUserName(item)}, a вот желание, которое тебе предстоит исполнить: ${await this.userService.getUserWish(item)}`));
        

    
  }
}


    

    
  

    
  

 
  
  module.exports = { BotApp };
  