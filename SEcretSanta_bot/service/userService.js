const { User } = require("../entity/user");

class UserService {
  async createUserMiddleware(ctx,next){
    
      const telegramUser = ctx.update.message.from;
  
      const [user, created] = await User.findOrCreate({
        where: { tgUserId: telegramUser.id },
        defaults: {
          tgUserId: telegramUser.id,
          username: telegramUser.username,
        },
      });
  
      //TODO: notice User in session
      ctx.session.localUser = user.dataValues;
      ctx.session.isNew = created;
  
      await next();
    }
  }

class FillWish {
  async fillUserWish(wish) {
    try {
      const fill = await User.update({
        wish: wish,
      });
      return fill;
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = { UserService, FillWish };