module.exports = (sequelize, Sequelize) => {
    const cors_product = sequelize.define("cors_product", {
        amount: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }
    });
    return cors_product;
};