module.exports = (sequelize, Sequelize) => {
    const Photo = sequelize.define("photo", {
        path: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        }
    })
    return Photo;
};    