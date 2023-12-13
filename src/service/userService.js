const { User } = require("../entity/user");
const shuffle = require("shuffle-array")
const _=require("lodash")

class UserService {
  async createUser(ctx){
    const newUser = await User.findOrCreate({
      where: { tgUserId: ctx.message.from.id },
        defaults: {
          tgUserId: ctx.message.from.id,
          username: ctx.message.from.username,
          wish: ctx.message.text,
          PartyId: ctx.session.chosenParty.id
        },
        
    })
    ctx.session.localUser = newUser.dataValues;


  }
  // async fillTargetId(id){
  async fillTargetId(){

    const participantsIds = await this.getUserIds();

    const shuffledIds = shuffle(Array().concat(participantsIds))

    const targetWish = await this.findTargetWishById(shuffledIds);

    const targetUsername = await this.findTargetUsernameById(shuffledIds);

    const pairs= _.zip(participantsIds, shuffledIds, targetWish,targetUsername);
    console.log(pairs)

    pairs.forEach(async pairsArray => {
      // pairsArray = [1, 4]

      const user1 = pairsArray[0];
      const user2 = pairsArray[1];
      const wish = pairsArray[2];
      const Username = pairsArray[3];


      await User.update(
        { targetId: user2, targetWish: wish, targetUsername: Username}, 
        {
          where: {
            id: user1
          }
        }     
      )
    })
  };

  
  async findTargetWishById(targetIds) {
    const targetWish = await Promise.all(targetIds.map(async (targetId) => {
      const user = await User.findOne({
        where: { id: targetId },
        attributes: ['wish'],
        raw: true
      });
      return user.wish;
    }));
  
    console.log(targetWish);
  
    return targetWish;
  }


  async findTargetUsernameById(targetIds) {
    const targetUsername = await Promise.all(targetIds.map(async (targetId) => {
      const user = await User.findOne({
        where: { id: targetId },
        attributes: ['username'],
        raw: true
      });
      return user.username;
    }));
  
    console.log(targetUsername);
  
    return targetUsername;
  }

  async getUserIds(){
    const participants = await User.findAll({
      attributes: ['id'],
      raw: true
    });

    const userIds =  participants.map(participants => participants.id)

    return userIds
  }

  async getTgId(userId){
    const tgUserId = await User.findOne({
      where: { id: userId },
      attributes: ['tgUserId'],
      raw: true
    });
    return tgUserId.tgUserId;
  }

  


  async getUserWish(userId){
    const targetWish = await User.findOne({
      where: { id: userId },
      attributes: ['targetWish'],
      raw: true
    });
    return targetWish.targetWish;
  }

  async getUserName(userId){
    const targetUsername = await User.findOne({
      where: { id: userId },
      attributes: ['targetUsername'],
      raw: true
    });
    return targetUsername.targetUsername;
  }
}
module.exports = { UserService };