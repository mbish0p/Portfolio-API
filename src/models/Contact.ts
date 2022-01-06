import mongoose from "mongoose";
import validaor from "validator";

const { Schema } = mongoose;

const ContactSchema = new Schema(
  {
    _id: mongoose.Types.ObjectId,
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: [true, "You already sign in, I will contact you soon"],
      validate: [validaor.isEmail, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Please enter an phone"],
    },
    message: String,
  },
  {
    timestamps: true,
    collection: "Contact",
  }
);

export default mongoose.model("Contact", ContactSchema);
