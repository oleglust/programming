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
}

module.exports = { PartyService };