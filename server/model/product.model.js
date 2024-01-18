module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.INTEGER
        },
        lastprice: {
            type: Sequelize.INTEGER
        },
        amount: {
            type: Sequelize.INTEGER
        },
        catid: {
            type: Sequelize.INTEGER
        },
        description: {
            type: Sequelize.STRING
        }
    });
    return Product;
};    