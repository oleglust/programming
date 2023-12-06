const { Party } = require("../entity/party");

class PartyService {
  async createParty(userId, deadline, isHide, price, pass) {
    try {
      const newParty = await Party.create({
        creatorId: userId,
        deadline: deadline,
        isHide: isHide,
        price: price,
        pass: pass

      });
      return newParty;
    } catch (error) {
      console.log(error);
    }
  };

  async findParty(hash){
    const chosenParty = await Party.findOne({ where: { pass: hash}})
    if (chosenParty !== null) {
      // console.log(chosenParty instanceof Party); // true
      // console.log(chosenParty.id); // 'My Title'
      return chosenParty
    } 
  }
}

module.exports = { PartyService };