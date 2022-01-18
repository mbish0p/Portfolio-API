"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const googleapis_1 = require("googleapis");
const nodemailer = require("nodemailer");
const Vonage = require("@vonage/server-sdk");
const Contact_1 = __importDefault(require("../models/Contact"));
var router = express_1.default.Router();
const sendConfirmMail = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oAuth2CLient = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);
        oAuth2CLient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
        const accesToken = yield oAuth2CLient.getAccessToken();
        const transport = nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.PORT,
            secure: true,
            auth: {
                type: "OAuth2",
                user: "biskup.mateusz.dev@gmail.com",
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accesToken,
            },
        });
        const mailOptions = {
            from: "<biskup.mateusz.dev@gmail.com>",
            to: `${email}`,
            subject: `Hello ${name}, nice to meet you 👾`,
            text: "I am watching you",
        };
        const result = yield transport.sendMail(mailOptions);
        return result;
    }
    catch (error) {
        return error;
    }
});
const sendSMS = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    const vonage = new Vonage({
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_SECRET,
        privateKey: "/Applications/XAMPP/xamppfiles/htdocs/portfolio-api/private.key",
        applicationId: process.env.APPLICATION_ID,
    });
    const from = "Portfolio";
    const to = Number(process.env.ADMIN_NUMBER);
    const text = `Someone just procces your contact form ${name}, ${email}`;
    vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        }
        else {
            if (responseData.messages[0]["status"] === "0") {
                console.log("Message sent successfully.");
            }
            else {
                console.log(`Message failed with error: ${responseData.messages[0]["error-text"]}`);
            }
        }
    });
});
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('dooing');
        const { name, phone, email, message } = req.body;
        const contact = new Contact_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            name,
            phone,
            email,
            message,
        });
        const savedContact = yield contact.save();
        if (savedContact) {
            yield sendConfirmMail(email, name);
            yield sendSMS(name, email);
        }
        res.status(200).json(savedContact);
    }
    catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
            const errorMessage = Object.values(error.errors).map((val) => val.message);
            res.status(400).send({
                errorMessage: errorMessage[0],
            });
        }
        else if (error.name === "MongoServerError" && error.code === 11000) {
            res.status(400).send({
                errorMessage: "You already sign in, I will contact you soon",
            });
        }
        else {
            res.status(500).send(error);
        }
    }
}));
router.get("/", (req, res) => {
    console.log("key", process.env.PUBLIC_KEY, process.env.PRIVATE_KEY);
    res.status(202).send({ message: 'hi' });
});
exports.default = router;
