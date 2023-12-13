const {DataTypes} = require("sequelize");
const{dbManager}=require("../db");
const{Model}=require("sequelize");


class Party extends Model {
    static associate(models) {
        models.Party.hasMany(models.User);
        
    }
}

Party.init(
    {
        id: {type: DataTypes.INTEGER, autoincrement: true, primaryKey: true},
        creatorId: {type: DataTypes.STRING, allowNull: false},
        deadline: {type: DataTypes.STRING, allowNull: true},
        isHide: {type: DataTypes.BOOLEAN, allowNull:true},
        price: {type: DataTypes.STRING},
        pass: {type:DataTypes.STRING},
    },
    {
    sequelize: dbManager,
    modelName: "Party",
    }
);

module.exports={Party};
