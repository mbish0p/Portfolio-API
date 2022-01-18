"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uri = "mongodb+srv://admin:admin6822@cluster0.w21tb.mongodb.net/Portfolio?retryWrites=true&w=majority";
mongoose_1.default
    .connect(uri)
    .then(() => {
    console.log("Connected to database ");
})
    .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
});
