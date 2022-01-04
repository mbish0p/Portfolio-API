import mongoose from "mongoose";

const uri =
  "mongodb+srv://Bish0p:SvPuJh735@cluster0.w21tb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

console.log("test");
const connection = mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });
// mongoose.connect(url,() => {
//   const collection = client.db("test").collection("devices");
//   console.log(collection, "in");
//   client.close();
// });

export default connection;
