import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  password: String,
  role: String,
});

export default mongoose.model("User", userSchema);
