const { Party } = require("../entity/party");

class PartyService {
  async createParty(userId, deadline, ishide, price, pass) {
    try {
      const newParty = await Party.create({
        creatorId: userId,
        deadline: deadline,
        ishide: ishide,
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