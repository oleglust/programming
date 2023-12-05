const {Sequelize }= require("sequelize");

const dbManager = new Sequelize({
    dialect: "sqlite",
    storage: "db.sqlite3",
})

module.exports ={dbManager};
