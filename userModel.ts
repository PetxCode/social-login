import mongoose from "mongoose";

interface iUser {
  email: string;
  password?: string;
}

interface iUserData extends iUser, mongoose.Document {}

const userModel = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model<iUserData>("User", userModel);
