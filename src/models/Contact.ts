import mongoose from "mongoose";
const { Schema } = mongoose;

const ContactSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  email: String,
  phone: String,
  message: Buffer,
});

export default mongoose.model("Contact", ContactSchema);
