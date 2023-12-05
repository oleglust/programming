const { Bot, session, GrammyError, HttpError, InlineKeyboard, Keyboard } = require("grammy");
const {PartyService}=require("../service/partyService")
const {UserService}=require("../service/userService")
const { dbManager } = require("../db");
// const { App } = require("../routes/router")


//const { RouteController, ROUTES } = require("../routes");

const partyService = new PartyService();

const VARIANT = {
  'new': "NEW",
  'created': "CREATED"
}

class BotApp {
    constructor(token) {
      this.bot = new Bot(token);
      this.userService = new UserService();
      // this.partyService = new PartyService();
      //this.routeController = new RouteController();
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
            localUser: null, 
            variant: null,
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
      ); 
  
      // this.bot.use(this.userService.createUserMiddleware);
  
      await this.startCommand();
      // await this.newKeyCommand();
      // await this.currentKeyCommand();
  


      
  
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

    //______________________________________________________________

    
  
    async startCommand() {
      const keyboard = new Keyboard()
        .text("У меня есть код к вечеринке")
        .row()
        .text("Создать новую вечеринку")
        .row();
  
      this.bot.command("start", async (ctx) => {
        await ctx.reply(
          `Выбери вариант:
          У меня есть код к вечеринке /key
          Создать новую вечеринку /new
         `,
         {
          reply_markup:keyboard
         }
        );
        ctx.session.localUser = ctx.message.from
      });

      this.bot.hears(["У меня есть код к вечеринке", "Создать новую вечеринку"], async(ctx)=>{
        if (ctx.message.text === "У меня есть код к вечеринке") { 
          ctx.session.variant = VARIANT.created
          await ctx.reply("введите код")
        };
        if (ctx.message.text === "Создать новую вечеринку") { 
          ctx.session.variant= VARIANT.new
          const keyboard = new InlineKeyboard()
          .text("неделя", "period_week")
          .text("две недели", "period_2week")
          await ctx.reply("Сколько времени на заполнение желаний?",{
            reply_markup: keyboard
          })

          }
      });

      this.bot.on('callback_query:data', async (ctx) => {
        

        if( ctx.session.variant === VARIANT.created){
          // TODO: принять код
        }

        if( ctx.session.variant === VARIANT.new){
          // TODO: gроверяем в цикле заполненность полей
          if(!ctx.session.createPartySteps.deadline){
            ctx.session.createPartySteps.creatorId = ctx.session.localUser.id;
            ctx.session.createPartySteps.deadline = ctx.callbackQuery.data;
            await ctx.reply("Средняя стоимость подарка?");
          }
          
          console.log(ctx.session.createPartySteps)
          if (ctx.session.createPartySteps.price != undefined) {
            const userMessage = await ctx.message.text
             ctx.session.createPartySteps.price = userMessage
            await ctx.reply("Скрыть пользователей?");
          }
          
          
          console.log(ctx.session.createPartySteps)

          const keyboard = new InlineKeyboard()
          .text("Да", "true")
          .text("Нет", "false")
            await ctx.reply("Скрыть пользователей?", {
              reply_markup: keyboard
            })
          if(!ctx.session.createPartySteps.isHide && ctx.session.createPartySteps.deadline != undefined){
            
          
            ctx.session.createPartySteps.isHide = ctx.callbackQuery.data;
            await ctx.reply("Средняя стоимость подарка?")

          }
          console.log(ctx.session.createPartySteps)

          // if( !ctx.session.createPartySteps.price && ctx.session.createPartySteps.isHide != undefined){
          //   ctx.session.createPartySteps.isHide = ctx.callbackQuery.data;
          //   await ctx.reply("Средняя стоимость подарка?")
          // };
          // console.log(ctx.session.createPartySteps)

         

          ctx.session.createPartySteps.pass = ctx.message.text
        }
      });


    //   this.bot.on('callback_query:data', async (ctx) => {
    //     if( !ctx.session.createPartySteps.price){
    //     ctx.session.createPartySteps.isHide = ctx.callbackQuery.data;
    //     await ctx.reply("Средняя стоимость подарка?")
    //   };

    //     if (!ctx.session.createPartySteps.pass) {
    //       ctx.session.createPartySteps.price = ctx.message.text
    //       await ctx.reply("Придумай код для входа в вечеринку");
    //     }

    //     ctx.session.createPartySteps.pass = ctx.message.text

    //   }) 
    // }
    
    // async newKeyCommand() {
    //   const keyboard = new InlineKeyboard()
    //     .text("будут скрыты", "hide")
    //     .row()
    //     .text("Будут открыты", "open")
    //     .row(); 
  
      // this.bot.command("new", async (ctx) => {
      //   await ctx.reply("Для начала укажи дату дедлайна");

      //   if (ctx.session.createPartySteps.deadline === undefined){ 
      //     ctx.session.createPartySteps.creatorId = ctx.session.localUser.tgUserId;
      //     ctx.session.createPartySteps.deadline = ctx.update.message.text;
      //     return ctx.reply("Имена людей будут скрыты?(Вы увидете только желание человека)", {
      //       reply_markup: keyboard,
      //     });
      //     }
          
      //   // if (){ 
      //   //   ;
      //   //   return ctx.reply("стоимость подарка");
      //   //   }
      // if (ctx.session.createPartySteps.price === undefined){ 
      //       ctx.session.createPartySteps.price = ctx.update.message.text;
      //       return ctx.reply("придумай пароль");
      //       }
      // if (ctx.session.createPartySteps.pass === undefined){ 
      //         ctx.session.createPartySteps.pass = ctx.update.message.text;
      //         return ctx.reply("пора заполнить собственные данные: /key");
      //         }

     
      // });

      // this.bot.callbackQuery("hide", async (ctx) => {
      //   ctx.session.createPartySteps.isHide = true
      // });
  
      // this.bot.callbackQuery("open", async (ctx) => {
      //   ctx.session.createPartySteps.isHide = false
      // });
  
      
    }
}
    

    //____________________________________________________________
    
  

    
  

 
  
  module.exports = { BotApp };
  