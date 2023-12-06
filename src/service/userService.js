const { User } = require("../entity/user");

class UserService {
  async createUser(ctx){
    const newUser = await User.findOrCreate({
      where: { tgUserId: ctx.message.from.id },
        defaults: {
          tgUserId: ctx.message.from.id,
          username: ctx.message.from.username,
          wish: ctx.message.text
        },
        
    })
    ctx.session.localUser = newUser.dataValues;


  }


//   async createUserMiddleware(ctx,next){
    
//       const telegramUser = ctx.message.from;
  
//       const [user, created] = await User.findOrCreate({
//         where: { tgUserId: telegramUser.id },
//         defaults: {
//           tgUserId: telegramUser.id,
//           username: telegramUser.username,
//         },
//       });
  
//       //TODO: notice User in session
//       ctx.session.localUser = user.dataValues;
//       ctx.session.isNew = created;
  
//       await next();
//     } 

//   async fillUserWish(userWish,userId) { 
//       try {
//         const fill = await User.update({
//           wish: userWish,
//         }, {where:{tgUserId:userId}});
//         return fill;
//       } catch (error) {
//         console.log(error);
//       }
//     };
//   }

// class FillWish {


//   async fillUserWish(wish) {
//     try {
//       const fill = await User.update({
//         wish: wish,
//       });
//       return fill;
//     } catch (error) {
//       console.log(error);
//     }
//   };
// }
}
module.exports = { UserService };