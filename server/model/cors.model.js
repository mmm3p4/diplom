module.exports = (sequelize, Sequelize) => {
    const Cors = sequelize.define("cors", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        }
    });
    return Cors;
};    