const { connect: db, connection } = require("mongoose").default;

const dbConnect = () => {
  // Connect to database
  db(`${process.env.MONGODB_URI}/${process.env.MONGODB_DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 1000,
  });
  connection.on("error", function () {
    console.error("connection error:");
    process.exit(1); // exit gracefully on error
  });
  connection.once("open", function () {
    // we're connected!
    console.log("Connected to database");
  });
};

module.exports = dbConnect;
