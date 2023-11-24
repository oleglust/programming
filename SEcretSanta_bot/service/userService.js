const { User } = require("../entity/user");

class UserService {
  async createUser(userId, username) {
    try {
      const newUser = await User.create({
        tgId: userId,
        username: username,
      });
      return newUser;
    } catch (error) {
      console.log(error);
    }
  };
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