const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL terhubung");
    await sequelize.sync({ alter: true });
    console.log("Tabel MySQL tersinkronisasi");
  } catch (error) {
    console.error("Gagal koneksi MySQL:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectMySQL };
