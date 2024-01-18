module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("order", {
        price: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        town: {
            type: Sequelize.STRING
        },
        delivery: {
            type: Sequelize.STRING,
            validate: {
                isIn: [['Самовывоз', 'Доставка']]
            }
        },
        address: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        }
    });
    return Order;
};    