
import "dotenv/config";
import Sequelize from "sequelize";

const dbConnection = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      port: process.env.DB_PORT,
      dialectOptions: {
        dateStrings: true,
        typeCast: function (field, next) {
          if (field.type === "DATETIME") {
            return field.string();
          }
          return next();
        },
      },
      timezone: "+05:30",
    }
  );


  dbConnection
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default dbConnection;

