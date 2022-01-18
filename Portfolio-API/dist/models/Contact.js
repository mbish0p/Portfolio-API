"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const { Schema } = mongoose_1.default;
const ContactSchema = new Schema({
    _id: mongoose_1.default.Types.ObjectId,
    name: {
        type: String,
        required: [true, "Please enter a name"],
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: [true, "You already sign in, I will contact you soon"],
        validate: [validator_1.default.isEmail, "Please enter a valid email"],
    },
    phone: {
        type: String,
        required: [true, "Please enter an phone"],
    },
    message: String,
}, {
    timestamps: true,
    collection: "Contact",
});
exports.default = mongoose_1.default.model("Contact", ContactSchema);
