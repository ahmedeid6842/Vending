require("dotenv").config();
require("express-async-errors");

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const { isAuthenticated } = require("./middleware/isAuthenticated")
const { role } = require("./middleware/role");
const { errorHandler } = require("./middleware/errorHandler");

const log = require("./utils/logger");
const { initDB } = require("./config/connectRedis");


const { User } = require("./routes/user")
const { Product } = require("./routes/product")
const { Payment } = require("./routes/payment")
const { Machine } = require("./routes/machine")

const app = express();

require("./utils/cache");
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(helmet());
app.use(compression());

//DONE: uncaught execption handling
process.on("uncaughtException", (ex) => {
    log.error(ex.message)
    process.exit(1)
});

//DONE: unhandeled promise rejections
process.on("unhandledRejection", (ex) => {
    log.error(ex.message)
    process.exit(1)
});

app.use("/user", User);
app.use("/product", Product);
app.use("/payment", isAuthenticated, role('buyer'), Payment);
app.use("/machine", Machine)
app.use((req, res) => {
    res.status(404).json({ message: `the endpoint ${req.url} you trying to access not found` });
});
app.use(errorHandler);

const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI).then(async () => {
    return await initDB();
}).then(() => {
    log.info('connected to Databases 🤝');
    app.listen(port, log.info(`listening on port ${port} 🚀🎯`));
})