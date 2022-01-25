"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./db/db");
//routes
const contact_1 = __importDefault(require("./routes/contact"));
var corsOptions = {
    origin: [
        "http://192.168.1.11/",
        "https://192.168.1.11/",
        "http://www.mateuszbiskupdev.com",
        "https://www.mateuszbiskupdev.com",
    ],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const app = (0, express_1.default)();
dotenv_1.default.config();
var jsonParser = body_parser_1.default.json();
express_1.default.json();
express_1.default.urlencoded();
app.use((0, cors_1.default)(corsOptions));
app.use(jsonParser);
app.use("/contact", contact_1.default);
app.listen(process.env.APPLICATION_PORT, () => {
    console.log("Server running on port", process.env.APPLICATION_PORT);
});
