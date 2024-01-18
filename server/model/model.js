const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        port: config.PORT,
        dialect: config.dialect,
        operatorsAliases: false,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.order = require("./order.model.js")(sequelize, Sequelize);
db.photo = require("./photo.model.js")(sequelize, Sequelize);
db.cors = require("./cors.model.js")(sequelize, Sequelize);
db.user_roles = require("./user_roles.js")(sequelize, Sequelize);
db.cors_product = require("./cors_product.js")(sequelize, Sequelize);

db.user.hasMany(db.order);
db.order.belongsTo(db.user);

db.product.hasMany(db.order);
db.order.belongsTo(db.product);

db.photo.hasOne(db.product);
db.product.belongsTo(db.photo);

db.user.hasOne(db.cors, { foreignKey: 'userId' });

db.cors.belongsToMany(db.product, {
    through: "cors_product",
    foreignKey: "corsId",
    otherKey: "productId"
  });
db.product.belongsToMany(db.cors, {
    through: "cors_product",
    foreignKey: "productId",
    otherKey: "corsId"
  });

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});
db.ROLES = ["user", "admin"];
module.exports = db;