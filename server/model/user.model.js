const crypto = require('crypto');
const MailService = require('../src/service/mail/mailer.service');
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        activated: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        subscribed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        activation_code: {
            type: Sequelize.STRING,
            defaultValue: () => Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
        },
        resetingCode: {
            type: Sequelize.STRING,
            defaultValue: null
        }


    });
    User.addHook('beforeCreate', async (user) => {
        const activationCode = user.activation_code;
        MailService.sendActivationCode(user.email, activationCode);
    });

    return User;
};    
