module.exports = {
    HOST: "localhost",
    PORT: "8080",
    USER: "postgres",
    PASSWORD: "423088",
    DB: "BUYF_MOBILE",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
