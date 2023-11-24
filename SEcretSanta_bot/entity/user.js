const {DataTypes} = require("sequelize");
const{dbManager}=require("../db");
const{Model}=require("sequelize")


class User extends Model {
    static associate(models) {
        models.User.belongsTo(models.Party);
        models.User.hasOne(models.Party);
    }
}

User.init(
    {
        id: {type: DataTypes.INTEGER, autoincrement: true, primaryKey: true},
        tgId: {type: DataTypes.STRING},
        username: {type: DataTypes.STRING, allowNull: true},
        isAdmin: {type: DataTypes.BOOLEAN, defaultValue: false},
        wish: {type: DataTypes.STRING, allowNull: true},
    },
    {
    sequelize: dbManager,
    modelName: "User",
    }
);

module.exports={User};
